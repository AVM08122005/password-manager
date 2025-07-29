import React from 'react'

const Footer = () => {
    const currentYear = new Date().getFullYear();
  return (
    <div className="bg-slate-800 text-white py-1 text-center text-balance  w-full">
      <p>&copy; {currentYear} PassOP</p>
      <p>Made with ❤️ by Achintya Mahajan</p>
    </div>
  )
}

export default Footer
