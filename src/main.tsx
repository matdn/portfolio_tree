import { ReactLenis } from '@studio-freight/react-lenis';
import ReactDOM from 'react-dom/client';
import GameReact from './game/GameReact.tsx';
import './i18n.js';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ReactLenis options={{ lerp: 0.1, duration: 1.5 }} root>
    <GameReact />
  </ReactLenis>
);
