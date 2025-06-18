// Note: The following assets need to be added to the project:
// - /assets/logos/haps-logo.svg
// - /assets/logos/oea-logo.svg
// - /assets/logos/bid-logo.svg
// - /assets/logos/ricg-logo.svg
// - /assets/logos/idrc-logo.svg

export interface AuthStatusTemplateProps {
  isAuthenticated: boolean;
  address: string;
  tokenId: string;
}

export const generateAuthStatusHTML = ({ isAuthenticated, address, tokenId }: AuthStatusTemplateProps): string => {
  const styles = {
    gradientStart: '#9747FF',
    gradientEnd: '#FFC700',
    purpleButton: '#9747FF',
    yellowButton: '#FFC700',
    grayButton: '#333333',
    textColor: '#333333',
    backgroundColor: '#ffffff',
  };

  return `
    <html lang="es">
      <head>
        <title>Estado de Autenticación | HAPS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Open Sans', sans-serif;
            background-color: ${styles.backgroundColor};
            color: ${styles.textColor};
            line-height: 1.6;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }

          .header {
            background: linear-gradient(120deg, ${styles.gradientStart}, ${styles.gradientEnd});
            padding: 2rem 3rem;
            display: flex;
            align-items: center;
            min-height: 120px;
          }

          .header-logo {
            display: flex;
            align-items: center;
            color: white;
            text-decoration: none;
            height: 80px;
          }

          .header-logo img {
            height: 80px;
            width: auto;
            filter: brightness(0) invert(1);
            object-fit: contain;
            display: block;
            transform: translateY(7px);
          }
          
          .header-logo img.error {
            display: none;
          }
          
          .header-logo .fallback {
            display: none;
            width: 80px;
            height: 80px;
            background: white;
            color: ${styles.gradientStart};
            font-weight: bold;
            font-size: 1.8rem;
            text-align: center;
            line-height: 80px;
            margin-right: 1.5rem;
          }
          
          .header-logo img.error + .fallback {
            display: block;
          }

          .header-title {
            font-size: 1.8rem;
            color: white;
            font-weight: 300;
            letter-spacing: 0.5px;
            align-self: center;
          }

          .nav-links {
            display: flex;
            gap: 2rem;
          }

          .nav-link {
            color: white;
            text-decoration: none;
            font-weight: 600;
            opacity: 0.9;
            transition: opacity 0.2s;
          }

          .nav-link:hover {
            opacity: 1;
          }

          .welcome-section {
            text-align: center;
            padding: 3rem 1rem;
          }

          .welcome-title {
            font-size: 2rem;
            margin-bottom: 2rem;
            position: relative;
            display: inline-block;
          }

          .welcome-title::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 0;
            width: 100%;
            height: 4px;
            background: ${styles.purpleButton};
            border-radius: 2px;
          }

          .button-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
          }

          .action-button {
            padding: 1rem 2rem;
            border-radius: 8px;
            border: none;
            color: white;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            transition: transform 0.2s;
          }

          .action-button:hover {
            transform: translateY(-2px);
          }

          .purple-button {
            background-color: ${styles.purpleButton};
          }

          .yellow-button {
            background-color: ${styles.yellowButton};
          }

          .gray-button {
            background-color: ${styles.grayButton};
          }

          .status-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            padding: 2.5rem;
            max-width: 800px;
            margin: 2rem auto;
            text-align: center;
          }

          .status-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: ${isAuthenticated ? styles.purpleButton : styles.grayButton};
          }

          .status-title {
            color: ${isAuthenticated ? styles.purpleButton : styles.grayButton};
            font-size: 1.8rem;
            margin-bottom: 1.5rem;
            font-weight: 600;
          }

          .info-card {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 1.5rem;
            margin: 1rem 0;
          }

          .info-label {
            font-weight: 600;
            color: ${styles.purpleButton};
            margin-bottom: 0.5rem;
          }

          .info-value {
            font-family: monospace;
            background: white;
            padding: 0.5rem;
            border-radius: 4px;
            word-break: break-all;
          }

          .status-message {
            color: ${isAuthenticated ? styles.purpleButton : styles.grayButton};
            font-weight: 600;
            margin-top: 1.5rem;
            padding: 1rem;
            border-radius: 8px;
            background: ${isAuthenticated ? 'rgba(151, 71, 255, 0.1)' : 'rgba(51, 51, 51, 0.1)'};
          }

          .partners-section {
            text-align: center;
            padding: 3rem 1rem;
            background: #f8f9fa;
          }

          .partners-title {
            color: ${styles.purpleButton};
            font-size: 1.5rem;
            margin-bottom: 2rem;
          }

          .partners-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
          }

          .partner-logo {
            max-width: 150px;
            height: auto;
            margin: 0 auto;
          }

          @media (max-width: 768px) {
            .header {
              flex-direction: column;
              text-align: center;
              padding: 1rem;
            }

            .nav-links {
              margin-top: 1rem;
              flex-direction: column;
              gap: 1rem;
            }

            .button-container {
              grid-template-columns: 1fr;
            }
          }
        </style>
        <script>
          function handleImageError(img) {
            img.classList.add('error');
            console.error('Failed to load image:', img.src);
          }
        </script>
      </head>
      <body>
        <header class="header">
          <a href="#" class="header-logo">
            <img src="/assets/logos/haps-logo.png" 
                 alt="HAPS Logo" 
                 onerror="handleImageError(this)"
            >
            <div class="fallback">HAP</div>
            <span class="header-title">- Adquisiciones de Impacto</span>
          </a>
        </header>

        <section class="welcome-section">
          <h1 class="welcome-title">Estado de Verificación</h1>
          
          <div class="status-container">
            <div class="status-icon">
              ${isAuthenticated ? '✓' : '✗'}
            </div>
            
            <h2 class="status-title">
              ${isAuthenticated ? 'Verificación Exitosa' : 'Verificación Fallida'}
            </h2>
            
            <div class="info-card">
              <div class="info-label">Dirección de Billetera</div>
              <div class="info-value">${address}</div>
            </div>
            
            <div class="info-card">
              <div class="info-label">ID del Token</div>
              <div class="info-value">${tokenId}</div>
            </div>
            
            <div class="status-message">
              ${
                isAuthenticated
                  ? '¡La dirección ha sido verificada exitosamente!'
                  : 'El proceso de verificación ha fallado. Por favor, verifique sus credenciales.'
              }
            </div>
          </div>
        </section>
      </body>
    </html>
  `;
};
