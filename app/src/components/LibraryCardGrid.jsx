import React from 'react'
import LibraryCard from './LibraryCard'
import ctv3 from '../images/ctv3.jpeg'
import ctv30 from '../images/ctv301.jpeg'
import erys from '../images/erys.webp'
import syre from '../images/syre.jpeg'

function LibraryCardGrid() {
  return (
    <div className='grid-card-container'>
      <LibraryCard title="CTV3: Day Tripper's Edition" artist="Jaden" image={ctv3} type="Album"></LibraryCard>
      <LibraryCard title="CTV3: Cool Tape Vol. 3" artist="Jaden" image={ctv30} type="Album"></LibraryCard>
      <LibraryCard title="ERYS (Deluxe)" artist="Jaden" image={erys} type="Album"></LibraryCard>
      <LibraryCard title="SYRE" artist="Jaden" image={syre} type="Album"></LibraryCard>
    </div>
  )
}

export default LibraryCardGrid
