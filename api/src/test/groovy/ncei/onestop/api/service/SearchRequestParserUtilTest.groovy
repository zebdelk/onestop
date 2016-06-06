package ncei.onestop.api.service

import groovy.json.JsonSlurper
import spock.lang.Specification


class SearchRequestParserUtilTest extends Specification {

    private slurper = new JsonSlurper()
    private requestParser = new SearchRequestParserUtil()

    def "Test completely empty params creates empty elasticsearch request" () {
        given:
        def emptyRequest = "{}"
        def params = slurper.parseText(emptyRequest)

        when:
        def result = requestParser.parseSearchRequest(params)
        def expectedString = """\
        {
          "bool" : {
            "must" : {
              "bool" : { }
            },
            "filter" : {
              "bool" : { }
            }
          }
        }""".stripIndent()

        then:
        !result.toString().empty
        result.toString().equals expectedString
    }


    def "Test empty but declared params creates empty elasticsearch request" () {
        given:
        def emptyRequest = "{\"queries\":[],\"filters\":[]}"
        def params = slurper.parseText(emptyRequest)

        when:
        def result = requestParser.parseSearchRequest(params)
        def expectedString = """\
        {
          "bool" : {
            "must" : {
              "bool" : { }
            },
            "filter" : {
              "bool" : { }
            }
          }
        }""".stripIndent()

        then:
        !result.toString().empty
        result.toString().equals expectedString
    }


    def "Test only queryText specified" () {
        given:
        def request = "{\"queries\":[{\"type\":\"queryText\",\"value\":\"winter\"}]}"
        def params = slurper.parseText(request)

        when:
        def result = requestParser.parseSearchRequest(params)
        def expectedString = """\
        {
          "bool" : {
            "must" : {
              "bool" : {
                "must" : {
                  "match" : {
                    "_all" : {
                      "query" : "winter",
                      "type" : "boolean"
                    }
                  }
                }
              }
            },
            "filter" : {
              "bool" : { }
            }
          }
        }""".stripIndent()

        then:
        !result.toString().empty
        result.toString().equals expectedString
    }
}
