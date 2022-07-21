; For testing let -keyword and scoping

(defc x "x") ; for scoping

(let ((y "y"))
    ; All are valid, only last one is returned
    (write y) ; => "y"
    (defc x "z") ; => "z"
    (+ 2 3) ; => 5
)