export type FabSize = 'small' | 'medium' | 'large'

export interface FabProps {
    label: string
    icon: string
    route: string
    size: FabSize
}
