# onvshark-alert

Lightweight vanilla-JS alert dialog — no dependencies, no jQuery, no framework required.

**Author:** Refael Sinaga · [refaelsinaga.com](https://refaelsinaga.com)  
**Version:** 1.0.0  
**License:** MIT

---

## Installation

Copy the two files into your project:

```
alert.css
alert.js
```

Include them in your HTML:

```html
<link rel="stylesheet" href="alert.css">
<script src="alert.js"></script>
```

---

## Usage

```js
onvsAlert(icon, type, title, message, buttons)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `icon` | `boolean` | `true` = show icon, `false` = no icon |
| `type` | `string` | `'success'` · `'danger'` · `'warning'` · `'info'` |
| `title` | `string` | Alert heading text |
| `message` | `string \| null` | Sub-text below the title (pass `null` to omit) |
| `buttons` | `object` | Button configuration (see below) |

### buttons object

```js
{
  confirm: {
    label  : 'Delete',      // button label
    icon   : 'trash',       // 'trash' | 'check' | 'x' | 'ok' | null
    color  : '#fd625e',     // background color (optional — defaults to type color)
    onClick: () => {}       // callback on click (optional)
  },
  cancel: {                 // optional — omit for close-only dialogs
    label  : 'Cancel',
    icon   : 'x',
    onClick: () => {}       // callback on click (optional)
  }
}
```

---

## Examples

### Close only (OK button)

```js
onvsAlert(true, 'success', 'Berhasil!', 'Data berhasil disimpan ke database.', {
  confirm: { label: 'OK', icon: 'ok' }
})

onvsAlert(true, 'info', 'Informasi', 'Sinkronisasi data selesai.', {
  confirm: { label: 'OK', icon: 'ok' }
})

onvsAlert(true, 'warning', 'Perhatian', 'Stok hampir habis, segera restok.', {
  confirm: { label: 'Mengerti', icon: 'ok' }
})

onvsAlert(true, 'danger', 'Gagal!', 'Koneksi server terputus.', {
  confirm: { label: 'OK', icon: 'ok' }
})
```

### Confirm & Cancel

```js
onvsAlert(true, 'success', 'Simpan Perubahan?', 'Pastikan data sudah benar sebelum disimpan.', {
  confirm: {
    label  : 'Confirm',
    icon   : 'check',
    onClick: () => {
      onvsAlert(true, 'success', 'Tersimpan!', 'Data berhasil diperbarui.', {
        confirm: { label: 'OK', icon: 'ok' }
      })
    }
  },
  cancel: { label: 'Cancel', icon: 'x' }
})
```

### Delete confirmation (chained)

```js
onvsAlert(true, 'danger', 'Hapus Data?', 'Data tidak bisa dikembalikan setelah dihapus.', {
  confirm: {
    label  : 'Delete',
    icon   : 'trash',
    onClick: () => {
      onvsAlert(true, 'success', 'Berhasil Dihapus!', 'Data telah berhasil dihapus dari sistem.', {
        confirm: { label: 'OK', icon: 'ok' }
      })
    }
  },
  cancel: { label: 'Cancel', icon: 'x' }
})
```

### Custom button color

```js
onvsAlert(true, 'warning', 'Hapus Produk?', 'Stok akan ikut terhapus secara permanen.', {
  confirm: {
    label  : 'Delete',
    icon   : 'trash',
    color  : '#ffbf53',
    onClick: () => {
      onvsAlert(true, 'success', 'Produk Dihapus!', 'Produk dan stok telah dihapus.', {
        confirm: { label: 'OK', icon: 'ok' }
      })
    }
  },
  cancel: { label: 'Cancel', icon: 'x' }
})
```

### Without icon

```js
onvsAlert(false, 'danger', 'Yakin Logout?', null, {
  confirm: { label: 'Logout', icon: 'x' },
  cancel : { label: 'Batal',  icon: 'x' }
})

onvsAlert(false, 'info', 'Konfirmasi', 'Lanjutkan proses ini?', {
  confirm: { label: 'Lanjutkan', icon: 'check' },
  cancel : { label: 'Batal',     icon: 'x' }
})
```

---

## Type colors

| Type | Color |
|------|-------|
| `success` | `#2ab57d` |
| `danger` | `#fd625e` |
| `warning` | `#ffbf53` |
| `info` | `#4ba6ef` |

## Button icons

| Key | Icon |
|-----|------|
| `trash` | Delete / trash icon |
| `check` | Checkmark |
| `x` | Close / X |
| `ok` | Checkmark (alias for confirm) |

---

## Behavior

- Clicking the **X** button (top-right corner) closes the dialog.
- Clicking **outside** the dialog box (the overlay) also closes it.
- `onClick` callbacks fire before the dialog closes.
- Dialogs can be **chained** — call `onvsAlert` inside an `onClick` to show a follow-up dialog.
