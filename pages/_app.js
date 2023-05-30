import { SessionProvider } from "next-auth/react"
import { ThirdwebWeb3Provider } from '@3rdweb/hooks';
import '../styles/globals.css';
import '../styles/styles.css';
import '../styles/transactionhistory.css'

const supportedChainIds = [11155111, 80001];
const connectors = {
  injected: {},
};


function MyApp({ Component, pageProps,session }) {
  return (
    <ThirdwebWeb3Provider
      supportedChainIds={supportedChainIds}
      connectors={connectors}>
       <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ThirdwebWeb3Provider>
  );
}

export default MyApp;
