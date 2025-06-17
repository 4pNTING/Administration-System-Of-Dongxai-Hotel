import Image from 'next/image'
import type { HTMLAttributes } from 'react'
const Logo = (props) => {
  return (
    <div style={{
      width: '100%',           // เต็มความกว้าง
      padding: '16px',         // padding รอบๆ
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1a1a1a' // ถ้าต้องการพื้นหลังสีเข้ม
    }}>
      <img
        src="/images/logos/LOGODONGXAIHOTEL.svg"
        alt="Dongxai Hotel"
        style={{
          width: '100%',         // เต็มความกว้างของ container
          maxWidth: '150px',     // จำกัดความกว้างสูงสุด
          height: 'auto',
          objectFit: 'contain'
        }}
        {...props}
      />
    </div>
  )
}

export default Logo