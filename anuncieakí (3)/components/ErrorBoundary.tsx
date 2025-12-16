import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // Em produção, aqui enviaríamos o erro para Sentry/Datadog
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gray-50">
          <h1 className="text-4xl mb-4">😵</h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ops, algo deu errado.</h2>
          <p className="text-gray-500 mb-6">Nossos engenheiros já foram notificados.</p>
          <Button onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}