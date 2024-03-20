import React from 'react'
import { LogoBehance, LogoDeviantart, LogoDribbble, LogoFacebook, LogoLinkedin, LogoTwitter } from 'react-ionicons'
import { useNavigate } from 'react-router'

const Navbar = () => {
  const navigate =  useNavigate()
  const navLinks = [
    {title:"Home", path:"/", active:true},
    {title:"Portfolio", path:"/", active:false},
    {title:"Newsletter", path:"/", active:false},
    {title:"Contact", path:"/", active:false},
    {title:"About", path:"/about", active:false},
    {title:"Blog", path:"/", active:false}
  ]

  return (
    <div className="w-full h-[60px] fixed top-4 left-0 flex z-50">
      <div className="w-full md:px-[235px] px-[23px] flex items-center justify-between">
        <div 
        className="text-orange-400 font-bold text-[28px] cursor-pointer md:ml-[12px]"
        onClick={() => navigate('/')}
        >
          Bongani <span className='text-orange-200'> Blog</span>
        </div>
        <div className="hidden md:flex items-center gap-12">
          {navLinks.map((link) =>{
            return (
              <a 
                href={link.path}
                key={link.title}
                className="font-normal text-[15px] text-white transition-all duration-200 hover:text-orange-400"
              >
                {link.title}
              </a>
            )
          })}
        </div>
        <div className="flex items-center gap-6">
          <LogoFacebook color={"#fff"} cssClasses={"cursor-pointer hover:fill-orange-400 transition-all duration-300"} />
          <LogoLinkedin color={"#fff"} cssClasses={"cursor-pointer hover:fill-orange-400 transition-all duration-300"} />
          <LogoTwitter color={"#fff"} cssClasses={"cursor-pointer hover:fill-orange-400 transition-all duration-300"} />
        </div>
      </div>
    </div>
  )
}

export default Navbar