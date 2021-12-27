import { useEffect } from 'react';

export const useBodyClass = (className: string) => {
    useEffect(() => {
        // Add a class to the body.
        document.body.classList.add(className);

        return () => {
            // Remove the class from the body.
            document.body.classList.remove(className);
        };
    }, [className]);
};

export default useBodyClass;
