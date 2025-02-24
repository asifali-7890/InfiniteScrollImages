import { useState, useEffect, useRef, useCallback } from 'react';

const InfiniteScrollImages = () => {
    const [images, setImages] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const loaderRef = useRef(null);

    // Fetch images function
    const fetchImages = useCallback(async () => {
        setLoading(true);
        // Simulated API call - replace with actual API call in real app
        const newImages = Array.from({ length: 10 }).map((_, index) => ({
            id: `${page}-${index}`,
            url: `https://picsum.photos/300/300?random=${page * 10 + index}`,
        }));

        setTimeout(() => {
            setImages((prev) => [...prev, ...newImages]);
            setPage((prev) => prev + 1);
            setLoading(false);
        }, 1000);
    }, [page]);

    // Intersection Observer callback
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const firstEntry = entries[0];
                if (firstEntry.isIntersecting && !loading) {
                    fetchImages();
                }
            },
            { threshold: 1.0 }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [fetchImages, loading]);

    return (
        <div className="container">
            <div className="image-grid">
                {images.map((image) => (
                    <div key={image.id} className="image-item">
                        <img src={image.url} alt="Random" />
                    </div>
                ))}
            </div>
            <div ref={loaderRef} className="loading-trigger">
                {loading && <div className="loader">Loading...</div>}
            </div>
        </div>
    );
};

export default InfiniteScrollImages;

// CSS Styles
const styles = `
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.image-item {
  position: relative;
  width: 100%;
  padding-top: 100%; /* Maintain square aspect ratio */
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.image-item img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-item:hover img {
  transform: scale(1.05);
}

.loading-trigger {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.loader {
  padding: 10px 20px;
  background: #f0f0f0;
  border-radius: 20px;
  font-size: 0.9em;
  color: #666;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.image-item {
  animation: fadeIn 0.5s ease-in;
}
`;

// Add styles to the document
const styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);