import React from "react"
import axios from "axios"
import { baseUrl, formatNumber, authorization } from "../config.js";
import domToPdf from "dom-to-pdf";

export default class Transaksi extends React.Component {
    constructor() {
        super()
        this.state = {
            transaksi: [],
            visible: "",
            user: ""
        }

        if (!localStorage.getItem("token")) {
            window.location.href = "/auth"
        }
    }

    getData() {
        let endpoint = `${baseUrl}/transaksi`
        axios.get(endpoint, authorization)
            .then(response => {
                let dataTransaksi = response.data
                for (let i = 0; i < dataTransaksi.length; i++) {
                    let total = 0;
                    for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
                        let harga = dataTransaksi[i].detail_transaksi[j].paket.harga
                        let qty = dataTransaksi[i].detail_transaksi[j].qty

                        total += (harga * qty)

                        // tambahkan key total
                        dataTransaksi[i].total = total
                    }
                }

                this.setState({ transaksi: dataTransaksi })
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.getData()
        let user = JSON.parse(localStorage.getItem("user"))

        // cara kedua
        if (user.role === 'Admin' || user.role === 'Kasir') {
            this.setState({
                visible: true
            })
        } else {
            this.setState({
                visible: false
            })
        }
    }

    convertStatus(id_transaksi, status) {
        if (status === 1) {
            return (
                <div className="badge bg-info">
                    Transaksi Baru
                    <br />

                    <a onClick={() => this.changeStatus(id_transaksi, 2)} className="text-danger">
                        Klik untuk melanjutkan proses
                    </a>
                </div>
            )
        } else if (status === 2) {
            return (
                <div className="badge bg-warning">
                    Sedang diproses

                    <br />

                    <a onClick={() => this.changeStatus(id_transaksi, 3)} className="text-danger">
                        Klik untuk melanjutkan proses
                    </a>
                </div>
            )
        } else if (status === 3) {
            return (
                <div className="badge bg-secondary">
                    Siap Diambil

                    <br />

                    <a onClick={() => this.changeStatus(id_transaksi, 4)} className="text-danger">
                        Klik untuk melanjutkan proses
                    </a>
                </div>
            )
        } else if (status === 4) {
            return (
                <div className="badge bg-success">
                    Telah Diambil
                </div>
            )
        }
    }

    changeStatus(id, status) {
        if (window.confirm(`Apakah Anda yakin ingin mengganti status transaksi ini?`)) {
            let endpoint = `${baseUrl}/transaksi/status/${id}`
            let data = {
                status: status
            }

            axios
                .post(endpoint, data, authorization)
                .then(response => {
                    window.alert(`Status transaksi telah diubah`)
                    this.getData()
                })
                .catch(error => console.log(error))
        }
    }

    deleteTransaksi(id) {
        if (window.confirm(`Apakah Anda yakin ingin menghapus transaksi ini ?`)) {
            let endpoint = `${baseUrl}/transaksi/${id}`
            axios.delete(endpoint, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
        }

    }

    convertStatusBayar(id_transaksi, dibayar) {
        if (dibayar === 0) {
            return (
                <div className="badge bg-danger text-white">
                    Belum Dibayar

                    <br />

                    <a className="text-primary"
                        onClick={() => this.changeStatusBayar(id_transaksi, 1)}>
                        Klik untuk mengganti status pembayaran
                    </a>
                </div>
            )
        } else if (dibayar === 1) {
            return (
                <div className="badge bg-success text-white">
                    Sudah Dibayar
                </div>
            )
        }
    }

    changeStatusBayar(id, status) {
        if (window.confirm(`Apakah Anda yakin ingin mengubah status pembayaran ini?`)) {
            let endpoint = `${baseUrl}/transaksi/bayar/${id}`
            axios.get(endpoint, authorization)
                .then(response => {
                    window.alert(`Status pembayaran telah diubah`)
                    this.getData()
                })
                .catch(error => console.log(error))
        }
    }

    convertPdf() {
        // ambil element yang akan diconvert ke pdf
        let element = document.getElementById(`target`)
        let options = {
            filename: "Rincian Data Transaksi.pdf"
        }

        domToPdf(element, options, () => {
            window.alert("file akan segera diunduh")
        })
    }

    printStruk(id) {
        var element = document.getElementById(`struk${id}`);
        var options = {
            filename: `struk-${id}.pdf`
        };
        domToPdf(element, options, function (pdf) {
            window.alert(`struk akan segera diunduh`)
        });
    }

    render() {
        const target = React.createRef()
        const optionPDF = {
            orientation: `landscape`,
            unit: `cm`,
            format: [21, 29.7]
        }
        return (
            <div className="container">
                <div className="card">
                    <div ref={target} id="target">
                        <div className="card-header bg-secondary">
                            <h4 className="text-white">
                                Form Transaksi
                            </h4>
                        </div>
                        <div className="card-body">
                            <button className="btn btn-danger"
                                onClick={() => this.convertPdf()}>
                                Convert to PDF
                            </button>
                            <ul className="list-group">
                                {this.state.transaksi.map(trans => (
                                    <li className="list-group-item">
                                        <div className="row">
                                            {/* this is member area */}
                                            <div className="col-lg-3">
                                                <small className="text-info">
                                                    Member
                                                </small> <br />
                                                {trans.member.nama}
                                            </div>

                                            {/* this is tgl transaksi area  */}
                                            <div className="col-lg-3">
                                                <small className="text-info">
                                                    Tanggal Transaksi
                                                </small> <br />
                                                {trans.tgl}
                                            </div>

                                            {/* this is batas waktu area  */}
                                            <div className="col-lg-3">
                                                <small className="text-info">
                                                    Batas Waktu
                                                </small> <br />
                                                {trans.batas_waktu}
                                            </div>

                                            {/* this is tanggal bayar area  */}
                                            <div className="col-lg-3">
                                                <small className="text-info">
                                                    Tanggal Bayar
                                                </small> <br />
                                                {trans.tgl_bayar}
                                            </div>

                                            {/* this is status area  */}
                                            <div className="col-lg-3">
                                                <small className="text-info">
                                                    Status
                                                </small> <br />
                                                {this.convertStatus(trans.id_transaksi, trans.status)}
                                            </div>

                                            {/* this is status pembayaran  */}
                                            <div className="col-lg-3">
                                                <small className="text-info">
                                                    Status Pembayaran
                                                </small> <br />
                                                {this.convertStatusBayar(trans.id_transaksi, trans.dibayar)}
                                            </div>

                                            <div className="col-lg-3">
                                                <small className="text-info">
                                                    Total
                                                </small><br />
                                                Rp {formatNumber(trans.total)}
                                            </div>

                                            <div className="col-lg-3">
                                                <small className={`text-info ${this.state.visible ? `` : `d-none`}`}>
                                                    Option
                                                </small><br />
                                                <button className={`btn btn-sm btn-outline-danger ${this.state.visible ? `` : `d-none`}`}
                                                    onClick={() => this.deleteTransaksi(trans.id_transaksi)}>
                                                    Hapus
                                                </button>
                                            </div>
                                        </div><hr />

                                        

                                        {/* area detail transaksi */}
                                        <h5>Detail Transaksi</h5>
                                        {trans.detail_transaksi.map(detail => (
                                            <div className="row">
                                                {/* area nama paket col-3 */}
                                                <div className="col-lg-3">
                                                    {detail.paket.jenis_paket}
                                                </div>
                                                {/* area quantity col-2*/}
                                                <div className="col-lg-2">
                                                    Qty: {detail.qty}
                                                </div>
                                                {/* area harga paket col-3*/}
                                                <div className="col-lg-3">
                                                    @ Rp {formatNumber(detail.paket.harga)}
                                                </div>
                                                {/* area harga total col-4  */}
                                                <div className="col-lg-4">
                                                    Rp {formatNumber(detail.paket.harga * detail.qty)}
                                                </div>
                                            </div>
                                        ))}


                                            {/* this is struk area */}
                                            <div className="col-lg-2">
                                                    <small className="text-info1">
                                                        Struk
                                                    </small><br />
                                                    <button className="btn btn-info btn-sm"
                                                        onClick={() => this.printStruk(trans.id_transaksi)}>
                                                        Struk PDF
                                                    </button>
                                                </div>

                                                <div style={{ display: `none` }}>
                                                    <div className="col-lg-12 p-3"
                                                        id={`struk${trans.id_transaksi}`}>
                                                        <h3 className="text-info1 text-center">
                                                        Rafi Laundry
                                                        </h3>
                                                        <h5 className="text-center">
                                                        Jl. Bromo No.120, Malang
                                                            <br />
                                                            Telp: 085330222234 | Jl. Bromo No.120, Malang
                                                        </h5>

                                                        <h4>Member: {trans.member.nama}</h4>
                                                        <h4>Tgl: {trans.tgl}</h4>

                                                        <div className="row mt-3"
                                                            style={{ borderBottom: `1px dotted black` }}>
                                                            <div className="col-4">
                                                                <h5>Paket</h5>
                                                            </div>
                                                            <div className="col-2">
                                                                <h5>Qty</h5>
                                                            </div>
                                                            <div className="col-3">
                                                                <h5>Harga Satuan</h5>
                                                            </div>
                                                            <div className="col-3">
                                                                <h5>Total</h5>
                                                            </div>
                                                        </div>

                                                        {trans.detail_transaksi.map(item => (
                                                            <div className="row mt-3"
                                                                style={{ borderBottom: `1px dotted black` }}>
                                                                <div className="col-4">
                                                                    <h5>{item.paket.jenis_paket}</h5>
                                                                </div>
                                                                <div className="col-2">
                                                                    <h5>{item.qty}</h5>
                                                                </div>
                                                                <div className="col-3">
                                                                    <h5>Rp {formatNumber(item.paket.harga)}</h5>
                                                                </div>
                                                                <div className="col-3">
                                                                    <h5>Rp {formatNumber(item.paket.harga * item.qty)}</h5>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        <div className="row mt-2">
                                                            <div className="col-lg-9"></div>
                                                            <div className="col-lg-3">
                                                                <h4>Rp {formatNumber(trans.total)}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                        


                                    </li>

                                            

                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}