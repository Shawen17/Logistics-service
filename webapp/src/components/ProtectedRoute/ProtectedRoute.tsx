import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { ReactNode } from 'react';
import { RootState } from '../interfaces';

interface ProtectedRouteProps {
  role: boolean;
  children: ReactNode;
}

function ProtectedRoute({
  role,
  children,
}: ProtectedRouteProps): JSX.Element | null {
  if (role) {
    return <>{children}</>;
  } else {
    return <Navigate to={{ pathname: '/' }} />;
  }
}

const delegatedRoles = ['picker', 'team_lead', 'manager'];

const mapStateToProps = (state: RootState) => ({
  role: delegatedRoles.includes(state.auth.role),
});

export default connect(mapStateToProps, null)(ProtectedRoute);
