const NavBar = () => {
    const pages = [
        {"name": "Home", "link": "home"},
        {"name": "Analysis", "link": "analysis"},
        {"name": "About", "link": "about"}
    ]
    return (
        <header className="bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="text-xl font-bold">
                Logo
              </a>
            </div>
            <div className="flex space-x-4">
                {pages.map((page) => (
                    <a href={`/${page.link}`} className={`text-base p-3 rounded-full font-bold hover:bg-emerald-600`}>
                        {page.name}
                    </a>
                ))}
            </div>
          </div>
        </div>
      </header>
    );
}

export default NavBar;