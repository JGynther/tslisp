; Hello -world- mom
(defc hello "hellomom") ; write variable hello
(write hello) 

((lambda (x y) 
    (/ (- y x) x))
    3 9
)