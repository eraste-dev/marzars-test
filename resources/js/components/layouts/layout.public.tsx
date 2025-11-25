import { ReactNode } from 'react';
import Navbar from './navbar';

function LayoutPublic({ children }: { children: ReactNode }) {
    return (
        <div>
            <Navbar />
            {children}
        </div>
    );
}

export default LayoutPublic;
