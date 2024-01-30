import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { XMLParser } from 'fast-xml-parser'
import { TSearchAddressToCoordsRes } from 'src/types/response.types'
import { DataSource, EntityManager } from 'typeorm'

@Injectable()
export class GeolocationService {
  constructor(@InjectEntityManager() private readonly entityManager: EntityManager, private datasource: DataSource) {}

  async getCoordsByAddress(address: string): Promise<TSearchAddressToCoordsRes> {
    const response = await fetch(`https://nominatim.openstreetmap.org/search.php?q=${address}&polygon_geojson=1&format=jsonv2`)
    const data = await response.json()
    return data[0] as TSearchAddressToCoordsRes
  }

  async reverseGeocoding(lat: number, lon: number): Promise<any> {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}`)
    const parser = new XMLParser()
    const data = await response.text()
    const objectData = parser.parse(data)
    return { ...objectData['reversegeocode']['addressparts'], location_full_text: objectData['reversegeocode']['result'] }
  }
}
