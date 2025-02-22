// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { useTranslation, I18nextProvider } from 'react-i18next'
import { ApplicationInsights, DistributedTracingModes } from '@microsoft/applicationinsights-web'
import Routes from './Routes'
import { ThemeProvider } from '@material-ui/styles'
import theme from './theme'
import './assets/scss/index.scss'
import './service/auth.js'
import { Auth } from '@cosmotech/core'
import { DigitalTwin as DigitalTwinView } from './views'

// TODO move this into a config file
const applicationInsightConfig = {
  name: 'Web Application Sample',
  config: {
    instrumentationKey: '05ef985d-8209-46db-acb0-d035da80faa1',
    disableFetchTracking: false,
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
    enableAutoRouteTracking: true,
    distributedTracingMode: DistributedTracingModes.AI_AND_W3C
  }
}

// TODO move this into a config file
const tabs = [
  {
    key: 'tabs.digitaltwin.key',
    label: 'layouts.tabs.digitaltwin.tab.title',
    to: '/digitaltwin',
    render: () => <DigitalTwinView /> // eslint-disable-line
  }
]

const App = () => {
  // TODO find an elegant way to set the title ( should be translatable)
  document.title = 'Cosmo Tech Web Application Sample'
  const [authenticated, setAuthenticated] = useState(false)
  // TODO: handle authorization and remove the eslint warning
  // eslint-disable-next-line no-unused-vars
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const authenticationDone = (authenticated) => {
      debugToken()
      if (authenticated) {
        setAuthenticated(authenticated)
        setAuthorized(authenticated) // TODO: handle authorization
      }
      // Bind callback to update state on authentication data change
      Auth.onAuthStateChanged(authData => {
        if (authData) {
          setAuthenticated(authData.authenticated)
          setAuthorized(authData.authenticated) // TODO: handle authorization
        }
      })
      setLoading(false)
    }
    const debugLocalKey = (key) => {
      const value = localStorage.getItem(key)
      if (value) {
        console.log(key + ': ' + value)
      } else {
        console.log(key + ': ' + 'NO VALUE')
      }
    }

    const debugToken = () => {
      debugLocalKey('authIdTokenPopup')
      debugLocalKey('authIdToken')
      debugLocalKey('authAccessToken')
    }

    const appInsights = new ApplicationInsights(applicationInsightConfig)
    appInsights.loadAppInsights()
    appInsights.trackPageView()

    // Check if the user is already signed-in
    async function signIn () {
      if (Auth.isAsync()) {
        return Auth.isUserSignedIn(authenticationDone)
      } else {
        return Auth.isUserSignedIn()
      }
    }
    signIn()
      .then((isSignInSuccessfully) => authenticationDone(isSignInSuccessfully))
  }, [])

  const toggleLang = () => {
    switch (i18n.language) {
      case 'en':
        i18n.changeLanguage('fr')
        break
      case 'fr':
        i18n.changeLanguage('en')
        break
      default:
        i18n.changeLanguage('en')
        break
    }
  }

  return loading === true
    ? (
          <I18nextProvider i18n={i18n}>
            <button onClick={toggleLang}>{t('commoncomponents.button.change.language', 'Change language')}</button>
            <ThemeProvider theme={theme}>
              <div className="spinner-border text-success" role="status">
                <span className="sr-only">{t('views.common.text.loading', 'Loading...')}</span>
              </div>
            </ThemeProvider>
          </I18nextProvider>
      )
    : (
          <I18nextProvider i18n={i18n}>
            <button onClick={toggleLang}>{t('commoncomponents.button.change.language', 'Change language')}</button>
            <ThemeProvider theme={theme}>
              <Router>
                <Routes authenticated={authenticated}
                  authorized={authenticated} tabs={tabs}/>
                {/* <Routes authenticated={this.state.authenticated}
                  authorized={this.state.authorized} /> */}
              </Router>
            </ThemeProvider>
          </I18nextProvider>
      )
}

export default App
