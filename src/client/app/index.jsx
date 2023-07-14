import { Routing } from '../pages';
import { MainLayout } from '../shared/ui';

import './index.css';

export const App = () => {
  return (
    <MainLayout>
      <Routing />
    </MainLayout>
  )
};
