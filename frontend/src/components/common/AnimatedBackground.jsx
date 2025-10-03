import React, { useEffect, useMemo, useState, useContext } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import { ThemeContext } from '../../context/ThemeContext';

const AnimatedBackground = () => {
    const [init, setInit] = useState(false);
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadFull(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const isDark = theme === 'mediavault_dark';

    const options = useMemo(() => ({
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
                value: isDark ? '#E0E0E0' : '#2C3E50',
            },
            links: {
                color: isDark ? '#E0E0E0' : '#2C3E50',
                distance: 150,
                enable: true,
                opacity: isDark ? 0.15 : 0.4,
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
                value: isDark ? 0.2 : 0.5,
            },
            shape: {
                type: 'circle',
            },
            size: {
                value: { min: 1, max: 2 },
            },
        },
        detectRetina: true,
    }), [isDark]);

    if (init) {
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -10 }}>
                <Particles
                    id="tsparticles"
                    options={options}
                />
            </div>
        );
    }

    return <></>;
};

export default AnimatedBackground;
