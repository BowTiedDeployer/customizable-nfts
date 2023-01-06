;; use the SIP009 interface (testnet)
;; trait deployed by deployer address from ./settings/Devnet.toml
(impl-trait .nft-trait.nft-trait)

;; define a new NFT. Make sure to replace car
(define-non-fungible-token car uint)

;; define errors
(define-constant err-owner-only (err u100))
(define-constant err-already-locked (err u101))
(define-constant err-more-votes-than-members-required (err u102))
(define-constant err-not-a-member (err u103))
(define-constant err-votes-required-not-met (err u104))
(define-constant err-invalid-name (err u301))
(define-constant err-no-rights (err u403))


;; Store the last issues token ID
(define-data-var last-id uint u0)

(define-map token-url { token-id: uint } { url: (string-ascii 256) })
;; this is used if we want for a given attribute value to give a specific url
;; eg. purple lambo car -> ipfs://dasd..
(define-map name-url { name: (string-ascii 30)} { url: (string-ascii 256) })

(map-set name-url  {name: "BentleyBlack"} {url: "ipfs://QmUeeP62n6izm2skUjr17RcVdr5b5PsTyGQwU8GMRg92ux/BentleyBlack.json"})
(map-set name-url  {name: "BentleyBlood"} {url: "ipfs://QmUeeP62n6izm2skUjr17RcVdr5b5PsTyGQwU8GMRg92ux/BentleyBlood.json"})
(map-set name-url  {name: "BentleyGold"} {url: "ipfs://QmUeeP62n6izm2skUjr17RcVdr5b5PsTyGQwU8GMRg92ux/BentleyGold.json"})
(map-set name-url  {name: "BentleyGrey"} {url: "ipfs://QmUeeP62n6izm2skUjr17RcVdr5b5PsTyGQwU8GMRg92ux/BentleyGrey.json"})
(map-set name-url  {name: "BentleyMidnight"} {url: "ipfs://QmUeeP62n6izm2skUjr17RcVdr5b5PsTyGQwU8GMRg92ux/BentleyMidnight.json"})
(map-set name-url  {name: "BentleyPurple"} {url: "ipfs://QmUeeP62n6izm2skUjr17RcVdr5b5PsTyGQwU8GMRg92ux/BentleyPurple.json"})
(map-set name-url  {name: "BentleyWhite"} {url: "ipfs://QmUeeP62n6izm2skUjr17RcVdr5b5PsTyGQwU8GMRg92ux/BentleyWhite.json"})
(map-set name-url  {name: "LamboBlue"} {url: "ipfs://QmUeeP62n6izm2skUjr17RcVdr5b5PsTyGQwU8GMRg92ux/LamboBlue.json"})
(map-set name-url  {name: "LamboEmerald"} {url: "ipfs://QmUeeP62n6izm2skUjr17RcVdr5b5PsTyGQwU8GMRg92ux/LamboEmerald.json"})
(map-set name-url  {name: "LamboGold"} {url: "ipfs://QmUeeP62n6izm2skUjr17RcVdr5b5PsTyGQwU8GMRg92ux/LamboGold.json"})
(map-set name-url  {name: "LamboGrey"} {url: "ipfs://QmUeeP62n6izm2skUjr17RcVdr5b5PsTyGQwU8GMRg92ux/LamboGrey.json"})
(map-set name-url  {name: "LamboPearlescent"} {url: "ipfs://QmUeeP62n6izm2skUjr17RcVdr5b5PsTyGQwU8GMRg92ux/LamboPearlescent.json"})
(map-set name-url  {name: "LamboRed"} {url: "ipfs://QmUeeP62n6izm2skUjr17RcVdr5b5PsTyGQwU8GMRg92ux/LamboRed.json"})

;; Owner
(define-data-var contract-owner principal tx-sender)



;; SIP009: Transfer token to a specified principal
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) err-no-rights)
    (nft-transfer? car token-id sender recipient)
  )
)

(define-public (transfer-memo (token-id uint) (sender principal) (recipient principal) (memo (buff 34)))
  (begin 
    (try! (transfer token-id sender recipient))
    (print memo)
    (ok true)
  )
)

;; SIP009: Get the owner of the specified token ID
(define-read-only (get-owner (token-id uint))
  ;; Make sure to replace car
  (ok (nft-get-owner? car token-id))
)

;; SIP009: Get the last token ID
(define-read-only (get-last-token-id)
  (ok (var-get last-id))
)


(define-read-only (get-token-uri (token-id uint)) 
  (let ((token-urr (get url (map-get? token-url {token-id: token-id})))) 
  (ok token-urr)
  )
)


;; Internal - Mint new NFT
(define-private (mint (new-owner principal))
  (begin 
    (asserts! (is-eq tx-sender (var-get contract-owner)) err-owner-only)
    (let 
      ((next-id (+ u1 (var-get last-id))))
      (var-set last-id next-id)
      (nft-mint? car next-id new-owner)
    )
  )
)

(define-public (mint-name (address principal) (name (string-ascii 30)))
    ;; define and assign: next-id and url
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) err-owner-only)
    (let 
      (
        (next-id (+ u1 (var-get last-id)))
        (url (get url (map-get? name-url {name: name})))
      )
      (if (is-none url)
        err-invalid-name
        (begin 
          (map-set token-url {token-id: next-id} {url: (unwrap-panic url)})
          (var-set last-id next-id)
          (nft-mint? car next-id address)
        )
      )
    )
  )
)

;; Burn a token
(define-public (burn-token (token-id uint))  
	(begin     
		(asserts! (is-eq (some tx-sender) (nft-get-owner? car token-id) ) err-no-rights)     
		(nft-burn? car token-id tx-sender)
  )
)

(define-read-only (get-name-url (name (string-ascii 30)))
  (let ((token-urr (get url (map-get? name-url {name: name})))) 
    (ok token-urr)
  )
)

(define-public (set-name-url (name (string-ascii 30)) (url (string-ascii 30))) 
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) err-owner-only)
    (ok (map-set name-url {name: name} {url: url}))
  )
)

(define-public (remove-name-url (name (string-ascii 30))) 
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) err-owner-only)
    (ok (map-delete name-url {name: name}))
  )
)


;; (mint-name 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 "BentleyBlack")
;; (mint-name 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 "BentleyBlood")
;; (mint-name 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 "PurLamboPearlescentple")
;; (mint-name 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 "LamboPearlescent")
;; (mint-name 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 "LamboRed")
