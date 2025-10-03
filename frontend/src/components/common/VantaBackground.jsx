import React, { useCallback, useContext } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { ThemeContext } from '../../context/ThemeContext';

const AnimatedBackground = () => {
    const { theme } = useContext(ThemeContext);

    const particlesInit = useCallback(async (engine) => {
        await loadFull(engine);
    }, []);

    const isDark = theme === 'mediavault_dark';

    const options = {
        background: {
            opacity: 0,
        },
        fpsLimit: 60,
        interactivity: {
            events: {
                onHover: {
                    enable: true,
                    mode: 'grab',
                },
            },
            modes: {
                grab: {
                    distance: 150,
                    links: {
                        opacity: isDark ? 0.3 : 0.5,
                    },
                },
            },
        },
        particles: {
            color: {
                value: isDark ? '#FFFFFF' : '#2C3E50',
            },
            links: {
                color: isDark ? '#FFFFFF' : '#2C3E50',
                distance: 150,
                enable: true,
                opacity: isDark ? 0.1 : 0.3,
                width: 1,
            },
            collisions: {
                enable: false,
            },
            move: {
                direction: 'none',
                enable: true,
                outModes: {
                    default: 'bounce',
                },
                random: false,
                speed: 0.5,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    area: 800,
                },
                value: 80,
            },
            opacity: {
                value: isDark ? 0.15 : 0.4,
            },
            shape: {
                type: 'circle',
            },
            size: {
                value: { min: 1, max: 2 },
            },
        },
        detectRetina: true,
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -10 }}>
            <Particles
                id="tsparticles"
                init={particlesInit}
                options={options}
                key={theme} // Force re-render on theme change
            />
        </div>
    );
};

export default AnimatedBackground;
