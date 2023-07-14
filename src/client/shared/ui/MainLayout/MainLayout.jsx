import { AppBar } from '../AppBar/AppBar';

export const MainLayout = ({ children }) => {
  return (
    <>
      <header>
        <AppBar />
      </header>
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          alignSelf: 'center',
          padding: '10%'
        }}
      >
        {children}
      </main>
      <footer style={{marginTop: 'auto'}} />
    </>
  );
};