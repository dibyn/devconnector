import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'

const PrivateRoute = ({
  component: Component,
  authentication: { isAuthenticated, loading },
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      loading ? (
        <Spinner />
      ) : isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect to='/login' />
      )
    }
  />
)

PrivateRoute.propTypes = {
  authentication: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  authentication: state.authentication,
})

export default connect(mapStateToProps)(PrivateRoute)
