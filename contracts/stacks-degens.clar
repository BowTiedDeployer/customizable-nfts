;; use the SIP009 interface (testnet)
(impl-trait .nft-trait.nft-trait)

(define-non-fungible-token stacks-degen uint)

;; define errors
(define-constant err-owner-only (err u100))
(define-constant err-no-rights (err u403))

;; Store the last issues token ID
(define-data-var last-id uint u0)
(define-data-var contract-owner principal tx-sender)

(define-map token-url { token-id: uint } { url: (string-ascii 256) })


;; SIP009: Transfer token to a specified principal
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) err-no-rights)
    (nft-transfer? stacks-degen token-id sender recipient)
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
  (ok (nft-get-owner? stacks-degen token-id))
)

;; SIP009: Get the last token ID
(define-read-only (get-last-token-id)
  (ok (var-get last-id))
)

;; SIP009: Get the token URI. You can set it to any other URI
(define-read-only (get-token-uri (token-id uint))
  (let ((token-urr (get url (map-get? token-url {token-id: token-id}))))
    (ok token-urr)
  )
)

;; Internal - Mint new NFT
(define-private (mint (new-owner principal))
  (let 
    ((next-id (+ u1 (var-get last-id))))
    (var-set last-id next-id)
    (nft-mint? stacks-degen next-id new-owner)
  )
)

(define-public (mint-uri (address principal) (url (string-ascii 256)))
  (begin 
    (asserts! (is-eq tx-sender (var-get contract-owner)) err-owner-only)
    (let 
      ((next-id (+ u1 (var-get last-id))))
      (map-set token-url {token-id: next-id} {url: url})
      (var-set last-id next-id)
      (nft-mint? stacks-degen next-id address)
    )
  )
)

;; Burn a token
(define-public (burn-token (token-id uint))
	(begin     
		(asserts! (is-eq (some tx-sender) (nft-get-owner? stacks-degen token-id)) err-no-rights)
		(nft-burn? stacks-degen token-id tx-sender)
  )
)

;; (mint-uri 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 "https://stxnft.mypinata.cloud/ipfs/QmbX7UCSFLBvJa2yB4YxqZxhacrxiKUGbE6fHbQuYMhNhf")
;; (mint-uri 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 "ipfs://will-be-here.json")
;; (mint-uri 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 "ipfs://will-be-here-2.json")
;; (mint-uri 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 "ipfs://will-be-here-3.json")
;; (mint-uri 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 "ipfs://totally-random.json")
