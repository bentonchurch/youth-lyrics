import { Application, extend } from '@pixi/react';
import { Container, Graphics, Sprite } from 'pixi.js';
import "./index.css";

import { SlideGroup } from './SlideGroup';
import { Background } from './Background';

extend({
  Container,
  Graphics,
  Sprite,
});

export function App() {
  return (
    <Application resizeTo={ window }>
      <SlideGroup>
        <Background src="../../img/bg.mp4" />
      </SlideGroup>
    </Application>
  );
}
