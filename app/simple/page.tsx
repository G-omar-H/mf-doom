export default function SimplePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#8CD4E6', padding: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '6rem', 
          fontWeight: '900', 
          color: 'black',
          lineHeight: '0.85',
          marginBottom: '2rem'
        }}>
          <span style={{ display: 'block' }}>THIS IS</span>
          <span style={{ display: 'block' }}>MF DOOM</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#737373' }}>
                      Paying tribute to the villain - collection curated by @thismfdoom_
        </p>
        <div style={{ 
          marginTop: '3rem', 
          padding: '2rem', 
          backgroundColor: 'white',
          borderRadius: '8px',
          maxWidth: '600px',
          margin: '3rem auto'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            Paying Tribute to the Villain
          </h2>
          <p style={{ lineHeight: '1.6' }}>
            Born from our Instagram community @thismfdoom_, this shop represents 
            our dedication to preserving and celebrating the legacy of Daniel Dumile.
          </p>
        </div>
      </div>
    </div>
  )
} 