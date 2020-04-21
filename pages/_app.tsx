/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import withRedux, { MakeStore, ReduxWrapperAppProps } from "next-redux-wrapper";
import App, { AppContext } from "next/app";
import Head from "next/head";
import React from "react";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import { all } from "typed-redux-saga";

import { rootReducer, RootState } from "../state";
import { candidatesCrudSagas, votesViewModelSaga } from "../state";
import theme from "../utils/theme";

/**
 * @param initialState The store's initial state (on the client side, the state of the server-side store is passed here)
 */
const makeStore: MakeStore = (initialState: RootState) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(sagaMiddleware))
  );

  function* rootSaga() {
    yield all([candidatesCrudSagas(), votesViewModelSaga()]);
  }

  sagaMiddleware.run(rootSaga);
  return store;
};

class MyApp extends App<ReduxWrapperAppProps<RootState>> {
  static async getInitialProps({ Component, ctx }: AppContext) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    return { pageProps };
  }

  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <React.Fragment>
        <Head>
          <title>People's Choice Awards</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}

export default withRedux(makeStore)(MyApp);
