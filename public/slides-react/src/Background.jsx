import { Assets } from 'pixi.js';
import { useEffect, useRef, useState } from 'react';

export function Background({ src }) {
    const ref = useRef(null)
    const [texture, setTexture] = useState();
    const [pos, setPos] = useState([0, 0]);
    const [scale, setScale] = useState(1);

    // Load the texture and handle sizing
    useEffect(() => {
      (async () => {
        const asset = await Assets.load(src);
        const onResize = () => {
          setPos([window.innerWidth / 2, window.innerHeight / 2])
          setScale(Math.max(window.innerWidth / asset.width, window.innerHeight / asset.height));
        };

        window.addEventListener("resize", onResize);
        asset.source.resource.loop = true;
        onResize();
        setTexture(asset);
      })();
    }, [src]);

    // If the texture exists, display the output
    return texture && (
      <pixiSprite
        ref={ref}
        anchor={0.5}
        texture={texture}
        scale={scale}
        x={pos[0]}
        y={pos[1]} />
    );
}
