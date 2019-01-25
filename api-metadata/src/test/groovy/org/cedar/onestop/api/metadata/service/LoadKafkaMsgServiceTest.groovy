package org.cedar.onestop.api.metadata.service

import org.cedar.schemas.avro.psi.ParsedRecord
import org.cedar.schemas.avro.util.AvroUtils
import spock.lang.Specification
import spock.lang.Unroll

@Unroll
class LoadKafkaMsgServiceTest extends Specification {
  def mockElasticsearchService = Mock(ElasticsearchService)
  def metadataManagementService = new MetadataManagementService(mockElasticsearchService)
  
  def setup() {
    metadataManagementService.PREFIX = 'prefix-'
    metadataManagementService.COLLECTION_SEARCH_INDEX = 'search_collection'
    metadataManagementService.COLLECTION_STAGING_INDEX = 'staging_collection'
    metadataManagementService.GRANULE_SEARCH_INDEX = 'search_granule'
    metadataManagementService.GRANULE_STAGING_INDEX = 'staging_granule'
    metadataManagementService.FLAT_GRANULE_SEARCH_INDEX = 'search_flattened_granule'
  }
  
  def "Load valid metadata to a staging index" () {
    given:
    def inputStream = ClassLoader.systemClassLoader.getResourceAsStream('example-record-avro.json')
    def inputRecord = AvroUtils.<ParsedRecord> jsonToAvro(inputStream, ParsedRecord.classSchema)

    Map parsedMap = [id: '123', parsedRecord: inputRecord]
    List<Map> parsedMapList = [parsedMap]
   
    when:
    def msgMap = metadataManagementService.loadParsedMetadata(parsedMapList)

    then:
    msgMap.data.id == ['123']
    msgMap.data.type == ['collection']
    msgMap.data.attributes.fileIdentifier == [inputRecord.discovery.fileIdentifier]
  }
}