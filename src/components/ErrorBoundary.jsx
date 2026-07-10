import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', color: '#ff4d4d', background: '#111', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h2>Oops! Algo salió mal en el panel.</h2>
          <p style={{ color: '#fff', marginBottom: '20px' }}>Por favor, envíame el siguiente código de error (puedes tomarle una foto o copiarlo) para solucionarlo de inmediato:</p>
          <div style={{ background: '#222', padding: '20px', borderRadius: '5px', overflowX: 'auto', border: '1px solid #444' }}>
            <h3 style={{ margin: 0, color: '#ff6b6b' }}>{this.state.error && this.state.error.toString()}</h3>
            <pre style={{ color: '#aaa', marginTop: '15px', fontSize: '12px' }}>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </div>
          <button 
            onClick={() => { window.location.href = '/'; }} 
            style={{ marginTop: '20px', padding: '10px 20px', background: '#d3b06d', color: '#000', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
          >
            VOLVER AL INICIO
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
