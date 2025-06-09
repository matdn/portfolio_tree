import { ReactLenis } from '@studio-freight/react-lenis';
import ReactDOM from 'react-dom/client';
import GameReact from './game/GameReact.tsx';
import './i18n.js';
import './index.css';
import CustomCursor from './game/views/doms/reacts/components/CustomCursor.tsx';
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(

  <ReactLenis options={{ lerp: 0.1, duration: 1.5 }} root>
    <GameReact />
    <CustomCursor />
  </ReactLenis>
);
