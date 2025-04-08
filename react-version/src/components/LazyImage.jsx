import React, { useState, useRef, useEffect, memo } from 'react';

const LazyImage = ({
    src,
    alt,
    className,
    style,
    placeholderColor = '#1c1c24',
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        // Observer para lazy loading
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (imgRef.current) {
                            imgRef.current.src = src;
                            observer.unobserve(imgRef.current);
                        }
                    }
                });
            },
            {
                rootMargin: '100px', // Começar a carregar quando estiver a 100px de distância da viewport
                threshold: 0.1
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, [src]);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setError(true);
        setIsLoaded(true);
    };

    const placeholderStyle = {
        backgroundColor: placeholderColor,
        transition: 'opacity 0.3s ease-in-out',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: isLoaded ? 0 : 1
    };

    const imgStyle = {
        ...style,
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
    };

    return (
        <div className={`relative ${className}`} style={{ overflow: 'hidden' }}>
            <div style={placeholderStyle}></div>
            <img
                ref={imgRef}
                alt={alt}
                onLoad={handleLoad}
                onError={handleError}
                style={imgStyle}
                className={`w-full h-full object-cover ${
                    error ? 'bg-gray-700' : ''
                }`}
                data-src={src}
                {...props}
            />
            {error && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-400"
                    title={`Não foi possível carregar a imagem: ${alt}`}
                >
                    <svg
                        className="w-1/4 h-1/4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default memo(LazyImage);
