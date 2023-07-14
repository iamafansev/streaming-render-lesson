import { Suspense, lazy } from 'react';

const waitFor = (delay) => {
    return new Promise((resolve) => setTimeout(resolve, delay));
};

// Получение компонента с фейковой задержкой.
const PokemonList = lazy(() =>
  import('./PokemonList')
    .then(async (module) => {
        await waitFor(1500);
        return module;
    })
    .then((module) => ({ default: module.PokemonList }))
);

// Получение компонента без фейк задержки
// const PokemonList = lazy(() =>
//   import('./PokemonList').then((module) => ({ default: module.PokemonList }))
// );

export const PokemonListLazy = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PokemonList />
    </Suspense>
  );
};