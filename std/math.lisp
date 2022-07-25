(defc abs
    (lambda (x)
        (if (< x 0)
                (- 0 x) 
                x )))

(defc max
    (lambda (x y)
        (if (> x y)
                x
                y )))

(defc min
    (lambda (x y)
        (if (< x y)
                x
                y )))
