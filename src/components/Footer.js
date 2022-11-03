import React from "react";

function Logout() {
	// remove data token dan user dari local storage
	localStorage.removeItem("user")
	localStorage.removeItem("token")
}

function Footer() {
	return (
		<div><br /><br />
			<footer className="bg-dark text-white pt-4 pb-5">
				<div className="container text-md-left">
					<div className="row text-md-left">
						<div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
							<h5 className="text-uppercase mb-4 font-weight-bold text-white">Rafi Laundry</h5>
							<p>Solusi cucian anda!</p>
						</div>

						<div className="col-md-4 col-lg-2 col-xl-2 mx-auto mt-3">
							<h5 className="text-uppercase mb-4 font-weight-bold text-white">Link Cepat</h5>
							<ul>
								<li><a href="/" className="text-white">Home</a></li>
								<li><a href="/member" className="text-white">Member</a></li>
								<li><a href="/paket" className="text-white">Paket</a></li>
								<li><a href="/user" className="text-white">User</a></li>
								<li><a href="/transaksi" className="text-white">Transaksi</a></li>
								<li><a href="/auth" className="text-white" onClick={() => Logout()}>Logout</a></li>
							</ul>
						</div>

						<div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
							<h5 className="text-uppercase mb-4 font-weight-bold text-white">Kontak</h5>
							<div className="row">
								<h6 className="text-white">Alamat: </h6>
								<h6 className="text-white">Jl. Bromo No.120, Malang</h6>
							</div>
							<div className="row">
								<h6 className="text-info">Email: </h6>
								<h6>rafilaundry@gmail.com</h6>
							</div>
							<div className="row">
								<h6 className="text-info">Telp: </h6>
								<h6>(+62)85330222234</h6>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	)
}
export default Footer;