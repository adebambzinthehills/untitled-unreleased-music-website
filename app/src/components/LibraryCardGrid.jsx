import React from 'react'
import LibraryCard from './LibraryCard'
import ctv3 from '../images/ctv3.jpeg'
import ctv30 from '../images/ctv30.webp'
import erys from '../images/erys.webp'
import syre from '../images/syre.jpeg'

function LibraryCardGrid() {
  return (
    <div className='grid-card-container'>
      <LibraryCard title="CTV3: Day Tripper's Edition" artist="Jaden Smith" image={ctv3}></LibraryCard>
      <LibraryCard title="CTV3: Cool Tape Vol. 3" artist="Jaden Smith" image={ctv30}></LibraryCard>
      <LibraryCard title="ERYS (Deluxe)" artist="Jaden Smith" image={erys}></LibraryCard>
      <LibraryCard title="SYRE" artist="Jaden Smith" image={syre}></LibraryCard>
    </div>
  )
}

export default LibraryCardGrid
