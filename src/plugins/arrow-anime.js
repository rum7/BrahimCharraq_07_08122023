export default function arrowDropdown({ addUtilities }) {
    const pseudoElementUtilities = {
        '.arrow': {
            width: '13px',
            height: '13px',
            position: 'relative',
          },
        '.arrow::before': {
            position: 'absolute',
            top: '0',
            left: '0',
            content: '""',
            width: '10px',
            height: '1px',
            backgroundColor: '#000',
            transition: 'all .4s ease',
            transform: 'translate(-5px, 9px) rotate(45deg)',
            transformOrigin: 'center right',
        },
        '.arrow::after': {
            position: 'absolute',
            top: '0',
            left: '0',
            content: '""',
            width: '10px',
            height: '1px',
            backgroundColor: '#000',
            transition: 'all .4s ease',
            transform: 'translate(5px, 9px) rotate(-45deg)',
            transformOrigin: 'center left',
        },
        '.arrow.open::before': {
            transform: 'translate(-5px, 1px) rotate(-45deg)',
        },
        '.arrow.open::after': {
            transform: 'translate(5px, 1px) rotate(45deg)',
        },
      }
  
    addUtilities(pseudoElementUtilities, {
        variants: ['before', 'after'],
    })
}