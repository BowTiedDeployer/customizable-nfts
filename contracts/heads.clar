;; use the SIP009 interface (testnet)
;; trait deployed by deployer address from ./settings/Devnet.toml
(impl-trait .nft-trait.nft-trait)

;; define a new NFT. Make sure to replace head
(define-non-fungible-token head uint)

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
;; eg. purple head -> ipfs://dasd..
(define-map name-url { name: (string-ascii 30)} { url: (string-ascii 256) })

;; Owner
(define-data-var contract-owner principal tx-sender)



;; SIP009: Transfer token to a specified principal
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) err-no-rights)
    (nft-transfer? head token-id sender recipient)
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
  ;; Make sure to replace head
  (ok (nft-get-owner? head token-id))
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
      (nft-mint? head next-id new-owner)
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
          (nft-mint? head next-id address)
        )
      )
    )
  )
)

;; Burn a token
(define-public (burn-token (token-id uint))  
	(begin     
		(asserts! (is-eq (some tx-sender) (nft-get-owner? head token-id) ) err-no-rights)     
		(nft-burn? head token-id tx-sender)
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


(map-set name-url {name: "NYC_Antenna_BigSmile"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Antenna_BigSmile.json"})
(map-set name-url {name: "NYC_Antenna_Cuban"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Antenna_Cuban.json"})
(map-set name-url {name: "NYC_Antenna_Elf"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Antenna_Elf.json"})
(map-set name-url {name: "NYC_Antenna_Kaonashi"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Antenna_Kaonashi.json"})
(map-set name-url {name: "NYC_Antenna_Lips"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Antenna_Lips.json"})
(map-set name-url {name: "NYC_Antenna_MemeGlasses"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Antenna_MemeGlasses.json"})
(map-set name-url {name: "NYC_Antenna_NosePiercing"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Antenna_NosePiercing.json"})
(map-set name-url {name: "NYC_Antenna_Vampire"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Antenna_Vampire.json"})
(map-set name-url {name: "NYC_Antenna_WhiteEyes"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Antenna_WhiteEyes.json"})
(map-set name-url {name: "NYC_BitcoinPolice_BigSmile"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_BitcoinPolice_BigSmile.json"})
(map-set name-url {name: "NYC_BitcoinPolice_Cuban"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_BitcoinPolice_Cuban.json"})
(map-set name-url {name: "NYC_BitcoinPolice_Elf"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_BitcoinPolice_Elf.json"})
(map-set name-url {name: "NYC_BitcoinPolice_Kaonashi"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_BitcoinPolice_Kaonashi.json"})
(map-set name-url {name: "NYC_BitcoinPolice_Lips"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_BitcoinPolice_Lips.json"})
(map-set name-url {name: "NYC_BitcoinPolice_MemeGlasses"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_BitcoinPolice_MemeGlasses.json"})
(map-set name-url {name: "NYC_BitcoinPolice_NosePiercing"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_BitcoinPolice_NosePiercing.json"})
(map-set name-url {name: "NYC_BitcoinPolice_Vampire"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_BitcoinPolice_Vampire.json"})
(map-set name-url {name: "NYC_BitcoinPolice_WhiteEyes"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_BitcoinPolice_WhiteEyes.json"})
(map-set name-url {name: "NYC_OpenMinded_BigSmile"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_OpenMinded_BigSmile.json"})
(map-set name-url {name: "NYC_OpenMinded_Cuban"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_OpenMinded_Cuban.json"})
(map-set name-url {name: "NYC_OpenMinded_Elf"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_OpenMinded_Elf.json"})
(map-set name-url {name: "NYC_OpenMinded_Kaonashi"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_OpenMinded_Kaonashi.json"})
(map-set name-url {name: "NYC_OpenMinded_Lips"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_OpenMinded_Lips.json"})
(map-set name-url {name: "NYC_OpenMinded_MemeGlasses"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_OpenMinded_MemeGlasses.json"})
(map-set name-url {name: "NYC_OpenMinded_NosePiercing"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_OpenMinded_NosePiercing.json"})
(map-set name-url {name: "NYC_OpenMinded_WhiteEyes"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_OpenMinded_WhiteEyes.json"})
(map-set name-url {name: "NYC_OpenMinded_Vampire"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_OpenMinded_Vampire.json"})
(map-set name-url {name: "NYC_Cowboy_BigSmile"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Cowboy_BigSmile.json"})
(map-set name-url {name: "NYC_Cowboy_Cuban"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Cowboy_Cuban.json"})
(map-set name-url {name: "NYC_Cowboy_Kaonashi"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Cowboy_Kaonashi.json"})
(map-set name-url {name: "NYC_Cowboy_Elf"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Cowboy_Elf.json"})
(map-set name-url {name: "NYC_Cowboy_Lips"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Cowboy_Lips.json"})
(map-set name-url {name: "NYC_Cowboy_MemeGlasses"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Cowboy_MemeGlasses.json"})
(map-set name-url {name: "NYC_Cowboy_NosePiercing"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Cowboy_NosePiercing.json"})
(map-set name-url {name: "NYC_Cowboy_Vampire"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Cowboy_Vampire.json"})
(map-set name-url {name: "NYC_Cowboy_WhiteEyes"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Cowboy_WhiteEyes.json"})
(map-set name-url {name: "NYC_GreatHair_BigSmile"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_GreatHair_BigSmile.json"})
(map-set name-url {name: "NYC_GreatHair_Cuban"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_GreatHair_Cuban.json"})
(map-set name-url {name: "NYC_GreatHair_Elf"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_GreatHair_Elf.json"})
(map-set name-url {name: "NYC_GreatHair_Kaonashi"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_GreatHair_Kaonashi.json"})
(map-set name-url {name: "NYC_GreatHair_Lips"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_GreatHair_Lips.json"})
(map-set name-url {name: "NYC_GreatHair_MemeGlasses"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_GreatHair_MemeGlasses.json"})
(map-set name-url {name: "NYC_GreatHair_NosePiercing"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_GreatHair_NosePiercing.json"})
(map-set name-url {name: "NYC_GreatHair_Vampire"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_GreatHair_Vampire.json"})
(map-set name-url {name: "NYC_GreatHair_WhiteEyes"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_GreatHair_WhiteEyes.json"})
(map-set name-url {name: "NYC_PUBG_BigSmile"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_PUBG_BigSmile.json"})
(map-set name-url {name: "NYC_PUBG_Cuban"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_PUBG_Cuban.json"})
(map-set name-url {name: "NYC_PUBG_Elf"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_PUBG_Elf.json"})
(map-set name-url {name: "NYC_PUBG_Kaonashi"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_PUBG_Kaonashi.json"})
(map-set name-url {name: "NYC_PUBG_Lips"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_PUBG_Lips.json"})
(map-set name-url {name: "NYC_PUBG_MemeGlasses"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_PUBG_MemeGlasses.json"})
(map-set name-url {name: "NYC_PUBG_NosePiercing"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_PUBG_NosePiercing.json"})
(map-set name-url {name: "NYC_PUBG_Vampire"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_PUBG_Vampire.json"})
(map-set name-url {name: "NYC_PUBG_WhiteEyes"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_PUBG_WhiteEyes.json"})
(map-set name-url {name: "NYC_Samurai_BigSmile"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Samurai_BigSmile.json"})
(map-set name-url {name: "NYC_Samurai_Cuban"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Samurai_Cuban.json"})
(map-set name-url {name: "NYC_Samurai_Elf"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Samurai_Elf.json"})
(map-set name-url {name: "NYC_Samurai_Lips"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Samurai_Lips.json"})
(map-set name-url {name: "NYC_Samurai_Kaonashi"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Samurai_Kaonashi.json"})
(map-set name-url {name: "NYC_Samurai_Vampire"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Samurai_Vampire.json"})
(map-set name-url {name: "NYC_Samurai_MemeGlasses"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Samurai_MemeGlasses.json"})
(map-set name-url {name: "NYC_Samurai_NosePiercing"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Samurai_NosePiercing.json"})
(map-set name-url {name: "NYC_Samurai_WhiteEyes"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Samurai_WhiteEyes.json"})
(map-set name-url {name: "NYC_Tomahawk_BigSmile"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Tomahawk_BigSmile.json"})
(map-set name-url {name: "NYC_Tomahawk_Cuban"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Tomahawk_Cuban.json"})
(map-set name-url {name: "NYC_Tomahawk_Elf"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Tomahawk_Elf.json"})
(map-set name-url {name: "NYC_Tomahawk_Kaonashi"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Tomahawk_Kaonashi.json"})
(map-set name-url {name: "NYC_Tomahawk_Lips"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Tomahawk_Lips.json"})
(map-set name-url {name: "NYC_Tomahawk_MemeGlasses"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Tomahawk_MemeGlasses.json"})
(map-set name-url {name: "NYC_Tomahawk_NosePiercing"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Tomahawk_NosePiercing.json"})
(map-set name-url {name: "NYC_Tomahawk_Vampire"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Tomahawk_Vampire.json"})
(map-set name-url {name: "NYC_Tomahawk_WhiteEyes"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/NYC_Tomahawk_WhiteEyes.json"})
(map-set name-url {name: "Miami_Crown_Bandana"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Crown_Bandana.json"})
(map-set name-url {name: "Miami_Crown_Cigar"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Crown_Cigar.json"})
(map-set name-url {name: "Miami_Crown_FlameEyes"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Crown_FlameEyes.json"})
(map-set name-url {name: "Miami_Crown_GoldTeeth"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Crown_GoldTeeth.json"})
(map-set name-url {name: "Miami_Crown_None"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Crown_None.json"})
(map-set name-url {name: "Miami_Crown_Sunglasses"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Crown_Sunglasses.json"})
(map-set name-url {name: "Miami_Bullet_Bandana"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Bullet_Bandana.json"})
(map-set name-url {name: "Miami_Bullet_Cigar"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Bullet_Cigar.json"})
(map-set name-url {name: "Miami_Bullet_FlameEyes"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Bullet_FlameEyes.json"})
(map-set name-url {name: "Miami_Bullet_GoldTeeth"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Bullet_GoldTeeth.json"})
(map-set name-url {name: "Miami_Bullet_None"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Bullet_None.json"})
(map-set name-url {name: "Miami_Bullet_Sunglasses"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Bullet_Sunglasses.json"})
(map-set name-url {name: "Miami_None_Bandana"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_None_Bandana.json"})
(map-set name-url {name: "Miami_None_Cigar"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_None_Cigar.json"})
(map-set name-url {name: "Miami_None_FlameEyes"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_None_FlameEyes.json"})
(map-set name-url {name: "Miami_None_GoldTeeth"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_None_GoldTeeth.json"})
(map-set name-url {name: "Miami_None_None"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_None_None.json"})
(map-set name-url {name: "Miami_None_Sunglasses"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_None_Sunglasses.json"})
(map-set name-url {name: "Miami_Party_Bandana"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Party_Bandana.json"})
(map-set name-url {name: "Miami_Party_Cigar"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Party_Cigar.json"})
(map-set name-url {name: "Miami_Party_FlameEyes"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Party_FlameEyes.json"})
(map-set name-url {name: "Miami_Party_GoldTeeth"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Party_GoldTeeth.json"})
(map-set name-url {name: "Miami_Party_None"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Party_None.json"})
(map-set name-url {name: "Miami_Party_Sunglasses"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Party_Sunglasses.json"})
(map-set name-url {name: "Miami_Sword_Bandana"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Sword_Bandana.json"})
(map-set name-url {name: "Miami_Sword_Cigar"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Sword_Cigar.json"})
(map-set name-url {name: "Miami_Sword_FlameEyes"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Sword_FlameEyes.json"})
(map-set name-url {name: "Miami_Sword_GoldTeeth"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Sword_GoldTeeth.json"})
(map-set name-url {name: "Miami_Sword_None"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Sword_None.json"})
(map-set name-url {name: "Miami_Sword_Sunglasses"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Sword_Sunglasses.json"})
(map-set name-url {name: "Miami_Syringe_Bandana"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Syringe_Bandana.json"})
(map-set name-url {name: "Miami_Syringe_Cigar"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Syringe_Cigar.json"})
(map-set name-url {name: "Miami_Syringe_FlameEyes"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Syringe_FlameEyes.json"})
(map-set name-url {name: "Miami_Syringe_GoldTeeth"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Syringe_GoldTeeth.json"})
(map-set name-url {name: "Miami_Syringe_None"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Syringe_None.json"})
(map-set name-url {name: "Miami_Syringe_Sunglasses"} {url: "ipfs://QmaFphBKc4QppqEu8uvEnzSEdSE57ZDXCWfpoAHFpAMnH8/Miami_Syringe_Sunglasses.json"})

;; (mint-name 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 "Miami_Sword_Sunglasses")
;; (mint-name 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 "Miami_Syringe_Bandana")
;; (mint-name 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 "Miami_Syringe_Cigar")
;; (mint-name 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 "Miami_Syringe_GoldTeeth")
;; (mint-name 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 "Miami_Syringe_None")
;; (mint-name 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 "Miami_Party_None")
;; (mint-name 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 "Miami_Party_GoldTeeth")
;; (mint-name 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 "Miami_Party_FlameEyes")
;; (mint-name 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 "NYC_Samurai_MemeGlasses")
;; (mint-name 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 "NYC_GreatHair_Elf")
;; (mint-name 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 "NYC_GreatHair_Kaonashi")
;; (mint-name 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 "NYC_GreatHair_Lips")
;; (mint-name 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 "NYC_GreatHair_MemeGlasses")
