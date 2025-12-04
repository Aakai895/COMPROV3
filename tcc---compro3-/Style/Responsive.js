export function getResponsiveSizes(width, height) {
  return {
    
    titleFontSize: Math.min(width * 0.07, 28), 
    subtitleFontSize: Math.min(width * 0.042, 18), 

    dotSize: Math.max(Math.min(width * 0.015, 10), 5), // todos
    circleSize: Math.min(width * 0.18, 60), // todos
    circleFontSize: Math.min(width * 0.045, 16), // todos
    arrowSize: Math.min(width * 0.05, 20), // todos

    captionFontSize: Math.max(Math.min(width * 0.038, 18), 14), // bv.3, login

    buttonPaddingH: Math.min(width * 0.1, 40), // login
    buttonPaddingV: Math.min(height * 0.025, 16), // login
    buttonFontSize: Math.min(width * 0.045, 18), // login
    logoWidth: Math.min(width * 0.3, 260), // login
    logoHeight: Math.min(height * 0.1, 290), // login
  };
}
