;; customizable-nfts
;; Wrapper which is combining parts and stacks-degens

;; Owner
(define-data-var contract-owner principal tx-sender)


;; constants
(define-constant err-invalid (err u300))
(define-constant err-too-many-pending-requests (err u200))
(define-constant err-not-owner (err u100))
(define-constant err-component-type-invalid (err u501))


(define-constant background-type "background-type")
(define-constant car-type "car-type")
(define-constant rim-type "rim-type")
(define-constant head-type "head-type")

(define-constant miami-type "miami")
(define-constant nyc-type "nyc")


(define-constant burn-address 'STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6)



;; public functions

;; Disassemble

;; eg. case
;; (contract-call? .stacks-degens mint-uri 'STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6 "uriNiceDegen")
;; ::set_tx_sender STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6
;; (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.customizable-nfts add-disassemble-work-in-queue u1)
;; ::set_tx_sender ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
;; (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.customizable-nfts disassemble-finalize u1 'STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6 "DarkPurple" "BentleyBlack" "ClassyCream" "Miami_Syringe_Cigar")
;; (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.cars get-token-uri u1)
;; (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.cars get-owner u1)


;; Queue for work
(define-data-var disassemble-work-queue (list 100 {member: principal, token-id: uint}) (list))

(define-public (disassemble-finalize (token-id uint) (member principal) (background-name (string-ascii 30)) (car-name (string-ascii 30)) (rim-name (string-ascii 30)) (head-name (string-ascii 30))) 
	(begin     
    ;; Check that admin is calling this contract
    (asserts! (is-eq tx-sender (var-get contract-owner)) err-invalid)
    (asserts! (is-eq (some token-id) (get token-id (unwrap-panic (get-disassemble-head-work-queue)))) err-invalid)
    (unwrap-panic (contract-call? .backgrounds mint-name member background-name)) 
    (unwrap-panic (contract-call? .cars mint-name member car-name))
    (unwrap-panic (contract-call? .rims mint-name member rim-name))
    (unwrap-panic (contract-call? .heads mint-name member head-name))
    (pop-disassemble-work-queue)
  )
)

(define-read-only (get-disassemble-work-queue)
  ;; Get the actual work-queue so that we can process it
  (ok (var-get disassemble-work-queue))
)

(define-read-only (get-disassemble-head-work-queue)
  ;; Get the first element in the work queue so that we can process it
  (ok (element-at (var-get disassemble-work-queue) u0))
)

(define-public (prepare-disassemble (token-id uint))
  (add-disassemble-work-in-queue token-id)
)

(define-public (add-disassemble-work-in-queue (token-id uint))
  (ok 
    (begin
      ;; check user is owner of nft
      (asserts! 
        (is-eq (some tx-sender) (unwrap-panic (contract-call? .stacks-degens get-owner token-id))) 
        err-not-owner
      )    
      ;; transfer fees if not contract-owner
      (if (is-eq tx-sender (var-get contract-owner)) true (try! (fee-processing)))
      (let 
        (
          (work-queue-value (var-get disassemble-work-queue))
          (value-to-add {token-id: token-id, member: tx-sender})
        )
        (var-set disassemble-work-queue
          (begin
            ;; check user has not already inserted this
            ;; if the id is already in the queue that means the NFT is burnt => throws err-not-owner when calling for get-owner 
            ;; (asserts! 
            ;;   (is-none (index-of work-queue-value value-to-add))
            ;;   err-invalid
            ;; )
            ;; check user is not abusing the queue
            (asserts! 
              (< (len (filter is-disassemble-value-for-principal work-queue-value)) u5)
              err-too-many-pending-requests
            )
            (unwrap-panic (contract-call? .stacks-degens burn-token token-id))
            (append 
              (unwrap-panic (as-max-len? work-queue-value u99)) 
              value-to-add
            )
          )
        )
      )
    )
  )
)

(define-private (pop-disassemble-work-queue)
  (ok 
    (let
      ((work-queue-value (var-get disassemble-work-queue)))
      (var-set disassemble-work-queue
        ;; Remove first element in list
        (filter is-disassemble-first-element work-queue-value)
      )
    )
  )
)

(define-public (pop-disassemble-work-queue-public)
  (ok 
    (let
      ((work-queue-value (var-get disassemble-work-queue)))
      (var-set disassemble-work-queue
        ;; Remove first element in list
        (filter is-disassemble-first-element work-queue-value)
      )
    )
  )
)

(define-private (is-disassemble-first-element (value {token-id: uint, member: principal}))
  (let
    ((first-element (element-at (var-get disassemble-work-queue) u0)))
    (not 
      (and
        (is-some first-element)
        (is-eq value (unwrap-panic first-element))
      )
    )
  )
)

(define-public (is-disassemble-first-element-public (value {token-id: uint, member: principal}))
  (ok 
    (let
      ((first-element (element-at (var-get disassemble-work-queue) u0)))
      (not 
        (and
          (is-some first-element)
          (is-eq value (unwrap-panic first-element))
        )
      )
    )
  )
)

;; Helper functions
(define-private (is-disassemble-value-for-principal (value {token-id: uint, member: principal}))
  (is-eq (get member value) tx-sender)
)

(define-public (is-disassemble-value-for-principal-public (value {token-id: uint, member: principal}))
  (ok (is-eq (get member value) tx-sender))
)



;; Assemble

;; eg. case
;; (contract-call? .backgrounds mint-name 'STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6 "DarkPurple")
;; (contract-call? .cars mint-name 'STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6 "BentleyBlack")
;; (contract-call? .rims mint-name 'STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6 "ClassyCream")
;; (contract-call? .heads mint-name 'STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6 "NYC_Antenna_BigSmile")
;; ::set_tx_sender STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6
;; (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.customizable-nfts add-assemble-work-in-queue u1 u1 u1 u1)
;; ::set_tx_sender ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
;; (contract-call? .customizable-nfts assemble-finalize 'STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6 "uri-custom")

(define-data-var assemble-work-queue (list 100 {member: principal, background-id: uint, car-id: uint, rim-id: uint, head-id: uint}) (list))

(define-public (assemble-finalize (member principal) (metadata-uri (string-ascii 99))) 
	(begin     
    ;; Check that admin is calling this contract
    (asserts! (is-eq tx-sender (var-get contract-owner)) err-invalid)
    (unwrap-panic (contract-call? .stacks-degens mint-uri member metadata-uri))
    (pop-assemble-work-queue)
  )
)

(define-read-only (get-assemble-work-queue)
  ;; Get the actual work-queue so that we can process it
  (ok (var-get assemble-work-queue))
)

(define-read-only (get-assemble-head-work-queue)
  ;; Get the first element in the work queue so that we can process it
  (ok (element-at (var-get assemble-work-queue) u0))
)

(define-public (prepare-assemble (background-id uint) (car-id uint) (rim-id uint) (head-id uint)) 
  (add-assemble-work-in-queue background-id car-id rim-id head-id)
)

(define-public (add-assemble-work-in-queue (background-id uint) (car-id uint) (rim-id uint) (head-id uint))
  (ok 
    (begin 
      ;; check user is owner of nft
      (asserts! 
        (and
          (is-eq (some tx-sender) (unwrap-panic (contract-call? .backgrounds get-owner background-id)))       
          (and
            (is-eq (some tx-sender) (unwrap-panic (contract-call? .cars get-owner car-id))) 
            (and
              (is-eq (some tx-sender) (unwrap-panic (contract-call? .rims get-owner rim-id))) 
              (is-eq (some tx-sender) (unwrap-panic (contract-call? .heads get-owner head-id))) 
            )
          )
        )
        err-not-owner
      )    
      (if (is-eq tx-sender (var-get contract-owner)) true (try! (fee-processing)))
      (let 
        (
          (work-queue-value (var-get assemble-work-queue))
          (value-to-add {
            member: tx-sender, 
            background-id: background-id,
            car-id: car-id,
            rim-id: rim-id,
            head-id: head-id
          })
        )      
        (var-set assemble-work-queue
          (begin
            ;; check user has not already inserted this
            ;; if the id is already in the queue that means the NFT is burnt => throws err-not-owner when calling for get-owner 
            ;; (asserts! 
            ;;   (is-none (index-of work-queue-value value-to-add))
            ;;   err-invalid
            ;; )
            ;; check user is not abusing the queue
            (asserts! 
              (< (len (filter is-assemble-value-for-principal work-queue-value)) u5)
              err-too-many-pending-requests
            )
            (unwrap-panic (contract-call? .backgrounds burn-token background-id))
            (unwrap-panic (contract-call? .cars burn-token car-id))
            (unwrap-panic (contract-call? .rims burn-token rim-id))
            (unwrap-panic (contract-call? .heads burn-token head-id))

            (append 
              (unwrap-panic (as-max-len? work-queue-value u99)) 
              value-to-add
            )
          )
        )
      )
    )
  )
)

(define-private (pop-assemble-work-queue)
  (ok 
    (let
      ((work-queue-value (var-get assemble-work-queue)))
      (var-set assemble-work-queue
        ;; Remove first element in list
        (filter is-assemble-first-element work-queue-value)
      )
    )
  )
)

(define-public (pop-assemble-work-queue-public)
  (ok 
    (let
      ((work-queue-value (var-get assemble-work-queue)))
      (var-set assemble-work-queue
        ;; Remove first element in list
        (filter is-assemble-first-element work-queue-value)
      )
    )
  )
)

(define-private (is-assemble-first-element (value {background-id: uint, car-id: uint, rim-id: uint, head-id: uint, member: principal}))
  (let
    ((first-element (element-at (var-get assemble-work-queue) u0)))

    (not 
      (and
        (is-some first-element)
        (is-eq value (unwrap-panic first-element))
      )
    )
  )
)

(define-public (is-assemble-first-element-public (value {background-id: uint, car-id: uint, rim-id: uint, head-id: uint, member: principal}))
  (ok 
    (let
      ((first-element (element-at (var-get assemble-work-queue) u0)))
      (not 
        (and
          (is-some first-element)
          (is-eq value (unwrap-panic first-element))
        )
      )
    )
  )
)

(define-private (is-assemble-value-for-principal (value {background-id: uint, car-id: uint, rim-id: uint, head-id: uint, member: principal}))
  (is-eq (get member value) tx-sender)
)

(define-public (is-assemble-value-for-principal-public (value {background-id: uint, car-id: uint, rim-id: uint, head-id: uint, member: principal}))
  (ok (is-eq (get member value) tx-sender))
)



;; SWAP

;; eg. case
;; (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.stacks-degens mint-uri 'STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6 "nice-link")
;; (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.rims mint-name 'STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6 "ClassyCream")
;; ::set_tx_sender STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6
;; (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.customizable-nfts add-swap-work-in-queue u1 u1 "rim-type")
;; ::set_tx_sender ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
;; (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.customizable-nfts swap-finalize 'STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6 "new-nice-link" "ClassyDark" "rim-type")
;; (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.rims get-token-uri u2)
;; (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.stacks-degens get-token-uri u4)


(define-data-var swap-work-queue (list 100 {member: principal, degen-id: uint, component-id: uint, component-type: (string-ascii 30)}) (list))

(define-public (swap-finalize (degen-id uint) (member principal) (metadata-uri-dgn (string-ascii 99)) (component-name (string-ascii 30)) (component-type (string-ascii 30)))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) err-invalid)
    (asserts! (is-eq (some degen-id) (get degen-id (unwrap-panic (get-swap-head-work-queue)))) err-invalid)
    (unwrap-panic (contract-call? .stacks-degens mint-uri member metadata-uri-dgn))
    (if (is-eq false
          (if (is-eq component-type background-type) 
            (unwrap-panic (contract-call? .backgrounds mint-name member component-name))
            (if (is-eq component-type car-type) 
              (unwrap-panic (contract-call? .cars mint-name member component-name))
              (if (is-eq component-type rim-type) 
                (unwrap-panic (contract-call? .rims mint-name member component-name))  
                (if (is-eq component-type head-type) 
                  (unwrap-panic (contract-call? .heads mint-name member component-name))
                  false   ;; component-type invalid
                )
              )
            )
          )
        )
      err-component-type-invalid
      ;; if any mint would have failed the function call would have been rolled back
      (pop-swap-work-queue)
    )
  )
)

(define-read-only (get-swap-work-queue)
  ;; Get the actual work-queue so that we can process it
  (ok (var-get swap-work-queue))
)

(define-read-only (get-swap-head-work-queue)
  ;; Get the first element in the work queue so that we can process it
  (ok (element-at (var-get swap-work-queue) u0))
)

(define-public (prepare-swap  (degen-id uint) (component-id uint) (component-type (string-ascii 30)))
  (add-swap-work-in-queue degen-id component-id component-type)
)

(define-public (add-swap-work-in-queue (degen-id uint) (component-id uint) (component-type (string-ascii 30)))
  (ok 
    (begin 
      ;; check user is owner of nft
      (asserts! 
        (and
          (is-eq (some tx-sender) (unwrap-panic (contract-call? .stacks-degens get-owner degen-id)))       
          (is-eq (some tx-sender)
              (if (is-eq component-type background-type) 
                (unwrap-panic (contract-call? .backgrounds get-owner component-id))
                (if (is-eq component-type car-type) 
                  (unwrap-panic (contract-call? .cars get-owner component-id))
                  (if (is-eq component-type rim-type) 
                    (unwrap-panic (contract-call? .rims get-owner component-id))  
                    (if (is-eq component-type head-type) 
                      (unwrap-panic (contract-call? .heads get-owner component-id))
                      none   ;; component-type invalid
                    )
                  )
                )
              )
          )
        )
        err-not-owner
      )    
      (if (is-eq tx-sender (var-get contract-owner)) true (try! (fee-processing)))
      (let 
        (
          (work-queue-value (var-get swap-work-queue))
          (value-to-add { 
            member: tx-sender,
            degen-id: degen-id,
            component-id: component-id,
            component-type: component-type
            })
        )      
        (var-set swap-work-queue
          (begin
            ;; check user has not already inserted this
            ;; if the id is already in the queue that means the NFT is burnt => throws err-not-owner when calling for get-owner 
            ;; (asserts! 
            ;;   (is-none (index-of work-queue-value value-to-add))
            ;;   err-invalid
            ;; )
            ;; check user is not abusing the queue
            (asserts! 
              (< (len (filter is-swap-value-for-principal work-queue-value)) u5)
              err-too-many-pending-requests
            )
            (unwrap-panic (contract-call? .stacks-degens burn-token degen-id))
            (if (is-eq component-type background-type) 
              (unwrap-panic (contract-call? .backgrounds burn-token component-id))
              (if (is-eq component-type car-type) 
                (unwrap-panic (contract-call? .cars burn-token component-id))
                (if (is-eq component-type rim-type) 
                  (unwrap-panic (contract-call? .rims burn-token component-id))  
                  (if (is-eq component-type head-type) 
                    (unwrap-panic (contract-call? .heads burn-token component-id))
                    false   ;; component-type invalid
                  )
                )
              )
            )            
            (append 
              (unwrap-panic (as-max-len? work-queue-value u99)) 
              value-to-add
            )
          )
        )
      )
    )
  )
)

(define-private (pop-swap-work-queue)
  (ok 
    (let
      ((work-queue-value (var-get swap-work-queue)))
      (var-set swap-work-queue
        ;; Remove first element in list
        (filter is-swap-first-element work-queue-value)
      )
    )
  )
)

(define-public (pop-swap-work-queue-public)
  (ok 
    (let
      ((work-queue-value (var-get swap-work-queue)))
      (var-set swap-work-queue
        ;; Remove first element in list
        (filter is-swap-first-element work-queue-value)
      )
    )
  )
)

(define-private (is-swap-first-element (value {degen-id: uint, component-id: uint, component-type: (string-ascii 30), member: principal}))
  (let
    ((first-element (element-at (var-get swap-work-queue) u0)))
    (not 
      (and
        (is-some first-element)
        (is-eq value (unwrap-panic first-element))
      )
    )
  )
)

(define-public (is-swap-first-element-public (value {degen-id: uint, component-id: uint, component-type: (string-ascii 30), member: principal}))
  (ok
    (let
      ((first-element (element-at (var-get swap-work-queue) u0)))
      (not 
        (and
          (is-some first-element)
          (is-eq value (unwrap-panic first-element))
        )
      )
    )
  )
)

(define-private (is-swap-value-for-principal (value {degen-id: uint, component-id: uint, component-type: (string-ascii 30), member: principal}))
  (is-eq (get member value) tx-sender)
)

(define-public (is-swap-value-for-principal-public (value {degen-id: uint, component-id: uint, component-type: (string-ascii 30), member: principal}))
  (ok (is-eq (get member value) tx-sender))
)



;; Merge

;; eg. case
;; ::set_tx_sender STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6
;; (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.miami-degens claim)
;; (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.nyc-degens claim)
;; (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.customizable-nfts add-merge-work-in-queue u1 "miami")
;; ::set_tx_sender ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
;; (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.customizable-nfts get-merge-work-queue)
;; (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.customizable-nfts merge-finalize 'STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6 "nice-new-nft")
;; (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.stacks-degens get-token-uri u1)

(define-data-var merge-work-queue (list 100 {member: principal, degen-id: uint, degen-type: (string-ascii 30)}) (list))

(define-public (merge-finalize (degen-id uint) (member principal) (metadata-uri-dgn (string-ascii 99)))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) err-invalid)
    (asserts! (is-eq (some degen-id) (get degen-id (unwrap-panic (get-merge-head-work-queue)))) err-invalid)
    (unwrap-panic (contract-call? .stacks-degens mint-uri member metadata-uri-dgn))
    (pop-merge-work-queue)
  )
)

(define-read-only (get-merge-work-queue)
  ;; Get the actual work-queue so that we can process it
  (ok (var-get merge-work-queue))
)

(define-read-only (get-merge-head-work-queue)
  ;; Get the first element in the work queue so that we can process it
  (ok (element-at (var-get merge-work-queue) u0))
)

(define-public (prepare-upgrade (degen-id uint) (degen-type (string-ascii 30)))
  (add-merge-work-in-queue degen-id degen-type)
)

(define-public (add-merge-work-in-queue (degen-id uint) (degen-type (string-ascii 30)))
  (ok 
    (begin
      ;; check user is owner of old Degen nft
      (asserts! 
        (is-eq (some tx-sender) 
          (if (is-eq degen-type miami-type)
            (unwrap-panic (contract-call? .miami-degens get-owner degen-id))
            (if (is-eq degen-type nyc-type)
              (unwrap-panic (contract-call? .nyc-degens get-owner degen-id))
              none
            )
          )
        ) 
        err-not-owner
      )    
      (if (is-eq tx-sender (var-get contract-owner)) true (try! (fee-processing)))
      (let 
        (
          (work-queue-value (var-get merge-work-queue))
          (value-to-add { 
            member: tx-sender,
            degen-id: degen-id,
            degen-type: degen-type
            })
        )
        (var-set merge-work-queue
          (begin
            ;; already insured by the fact that the nft is burned
            ;; ;; check user has not already inserted this
            ;; (asserts! 
            ;;   (is-none (index-of work-queue-value value-to-add))
            ;;   err-invalid
            ;; )

            ;; check user is not abusing the queue
            (asserts! 
              (< (len (filter is-merge-value-for-principal work-queue-value)) u5)
              err-too-many-pending-requests
            )

            ;; (unwrap-panic (contract-call? .old-degens burn-token degen-id))
            
            (some (burn-old-nft degen-id degen-type))

            (append 
              (unwrap-panic (as-max-len? work-queue-value u99)) 
              value-to-add
            )
          )
        )
      )
    )
  )
)

(define-private (pop-merge-work-queue)
  (ok 
    (let
      ((work-queue-value (var-get merge-work-queue)))
      (var-set merge-work-queue
        ;; Remove first element in list
        (filter is-merge-first-element work-queue-value)
      )
    )
  )
)

(define-public (pop-merge-work-queue-public)
  (ok 
    (let
      ((work-queue-value (var-get merge-work-queue)))
      (var-set merge-work-queue
        ;; Remove first element in list
        (filter is-merge-first-element work-queue-value)
      )
    )
  )
)

(define-private (burn-old-nft (degen-id uint) (degen-type (string-ascii 30))) 
  (if (is-eq 
        false
        (if (is-eq degen-type miami-type)
          (unwrap-panic (contract-call? .miami-degens transfer degen-id tx-sender burn-address))
          (if (is-eq degen-type nyc-type)
            (unwrap-panic (contract-call? .nyc-degens transfer degen-id tx-sender burn-address))
            false  
          )
        )
      )
    err-component-type-invalid
    (ok (some degen-id))
  )
)

(define-public (burn-old-nft-public (degen-id uint) (degen-type (string-ascii 30))) 
  (if (is-eq 
        false
        (if (is-eq degen-type miami-type)
          (unwrap-panic (contract-call? .miami-degens transfer degen-id tx-sender burn-address))
          (if (is-eq degen-type nyc-type)
            (unwrap-panic (contract-call? .nyc-degens transfer degen-id tx-sender burn-address))
            false  
          )
        )
      )
    err-component-type-invalid
    (ok (some degen-id))
  )
)

(define-private (is-merge-first-element (value {degen-id: uint, degen-type: (string-ascii 30), member: principal}))
  (let
    ((first-element (element-at (var-get merge-work-queue) u0)))

    (not 
      (and
        (is-some first-element)
        (is-eq value (unwrap-panic first-element))
      )
    )
  )
)

(define-public (is-merge-first-element-public (value {degen-id: uint, degen-type: (string-ascii 30), member: principal}))
  (ok
    (let
      ((first-element (element-at (var-get merge-work-queue) u0)))

      (not 
        (and
          (is-some first-element)
          (is-eq value (unwrap-panic first-element))
        )
      )
    )
  )
)

(define-private (is-merge-value-for-principal (value {degen-id: uint, degen-type: (string-ascii 30), member: principal}))
  (is-eq (get member value) tx-sender)
)

(define-public (is-merge-value-for-principal-public (value {degen-id: uint, degen-type: (string-ascii 30), member: principal}))
  (ok (is-eq (get member value) tx-sender))
)


;; fees: 0.69 stx
(define-private (fee-processing)
  (stx-transfer? u690000 tx-sender (var-get contract-owner))
)

(define-public (fee-processing-public)
  (stx-transfer? u690000 tx-sender (var-get contract-owner))
)