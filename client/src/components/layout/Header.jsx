import {Bell} from 'lucide-react'

function Header() {
  return (
    <div className="navbar  px-3 bg-[#242424] ">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /> </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li><a>Homepage</a></li>
            <li><a>Portfolio</a></li>
            <li><a>About</a></li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">SyncChat</a>
      </div>
      <div className="navbar-end">

        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <Bell />
            <span className="badge badge-xs badge-primary bg-[#248F60] indicator-item">10</span>
          </div>
        </button>
        <div className="avatar ml-4 avatar-placeholder">
          <div className="bg-neutral text-neutral-content w-8 rounded-full">
            <img src="/image.png" className='object-cover' alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header