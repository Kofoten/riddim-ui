import styled from 'styled-components';

export const RoomListLayout = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
    column-gap: 1rem;
    row-gap: 1rem;
    padding: 1rem;
    width: 100%;
`

export const RoomListItemLayout = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: no-wrap;
    background-color: ${props => props.theme.primary};
    border-radius: .15rem;
    max-height: 5rem;
    overflow: hidden;
    transition: background-color .25s;
    &:hover {
        background-color: ${props => props.theme.variant};
    }
`

export const RoomListItemImage = styled.img`
    height: 5rem;
    width: 5rem;
    object-fit: cover;
`

export const RoomListItemText = styled.div`
    padding-left: .5rem;
`