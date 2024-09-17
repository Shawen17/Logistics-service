import { useEffect } from 'react';
import { connect } from 'react-redux';
import { logout } from '../../action/auth';
import { useNavigate } from 'react-router-dom';

interface LogoutProps {
  logout: () => void;
}

const Logout: React.FC<LogoutProps> = ({ logout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  return null;
};

export default connect(null, { logout })(Logout);
