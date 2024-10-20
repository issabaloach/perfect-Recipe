function Newsletter () {
    return (
        <div className="container mx-auto max-w-screen-lg px-4 p-8 md:p-16 bg-pink-100 text-center">
        <h2 className="text-3xl font-bold mb-4">Let's Stay In Touch!</h2>
        <p className="mb-6">Join our newsletter, so that we reach out to you with our news and offers.</p>
        <div className="flex justify-center">
          <input type="email" placeholder="Your email address" className="px-4 py-2 rounded-l-full w-64" />
          <button className="text-sm bg-[#B55D51] text-white px-6 py-2 rounded-r-md">Subscribe</button>
        </div>
      </div>
    )
}

export default Newsletter