(write (lambda (x) (+ x 1))) ; except function

((lambda (x) (+ x 1)) 1) ; => 2

((lambda (a b) (+ a b)) 2 (+ 2 5)) ; => 9