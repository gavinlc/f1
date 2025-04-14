import { useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { f1Api } from '../services/f1Api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Button } from '../components/ui/button'

export function Results() {
  const [selectedRound, setSelectedRound] = useState<string>('1')
  const tabsListRef = useRef<HTMLDivElement>(null)

  // Query for basic race information
  const { data: racesData, isLoading: isLoadingRaces } = useQuery({
    queryKey: ['races', '2024'],
    queryFn: () => f1Api.getRaceResults('2024'),
  })

  // Query for selected race results
  const { data: selectedRaceData, isLoading: isLoadingResults } = useQuery({
    queryKey: ['race-results', '2024', selectedRound],
    queryFn: () => f1Api.getSingleRaceResult('2024', selectedRound),
    enabled: !!selectedRound,
  })

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsListRef.current) {
      const scrollAmount = 200 // Adjust this value as needed
      const currentScroll = tabsListRef.current.scrollLeft
      const newScroll =
        direction === 'left'
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount

      tabsListRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth',
      })
    }
  }

  if (isLoadingRaces) {
    return <div>Loading...</div>
  }

  const races = racesData?.MRData.RaceTable.Races || []

  // If no races are available, show a message
  if (races.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">2024 F1 Race Results</h1>
        <p>No race results available yet for the 2024 season.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">2024 F1 Race Results</h1>
      <Tabs
        defaultValue={selectedRound}
        onValueChange={setSelectedRound}
        className="w-full"
      >
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
            onClick={() => scrollTabs('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div
            className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            ref={tabsListRef}
          >
            <TabsList className="flex gap-1 min-w-max px-10">
              {races.map((race) => (
                <TabsTrigger
                  key={race.round}
                  value={race.round}
                  className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
                >
                  Round {race.round}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
            onClick={() => scrollTabs('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {races.map((race) => (
          <TabsContent key={race.round} value={race.round}>
            <Card>
              <CardHeader>
                <CardTitle>{race.raceName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-gray-600">
                    <p>
                      <span className="font-medium">Date:</span>{' '}
                      {new Date(race.date).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Circuit:</span>{' '}
                      {race.Circuit.circuitName}
                    </p>
                  </div>
                  {isLoadingResults ? (
                    <div>Loading results...</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Pos
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Driver
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Team
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Time/Gap
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Points
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedRaceData?.MRData.RaceTable.Races[0]?.Results.map(
                            (result) => (
                              <tr key={result.Driver.driverId}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {result.position}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {result.Driver.givenName}{' '}
                                  {result.Driver.familyName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {result.Constructor.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {result.Time?.time || result.status}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {result.points}
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
