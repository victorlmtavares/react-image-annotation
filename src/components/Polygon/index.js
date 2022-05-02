import React from 'react'
import LineTo from 'react-lineto'
import styled from 'styled-components'
import { Rnd } from 'react-rnd'

const PointDot = styled.div`
  background: red;
  border-radius: 3px;
  width: 4px;
  height: 4px;
  position: absolute;
`

function edgesFromPoints(points) {
  if (!points || points.length < 3) return [];

  const edges = []
  for (let i = 0; i < points.length; ++i) {
    if (i + 1 === points.length) {
      edges.push(Math.hypot(points[0].x-points[i].x, points[0].y-points[i].y))
    } else {
      edges.push(Math.hypot(points[i + 1].x-points[i].x, points[i + 1].y-points[i].y))
    }
  }

  return edges;
}

function coordinatesToPercentage(draggableData) {
  const rect = $('#react-container')[0].getBoundingClientRect();
  const offsetX = draggableData.lastX;
  const offsetY = draggableData.lastY;
  return {
      x: offsetX / (rect.width - 2) * 100,
      y: offsetY / (rect.height - 2) * 100
  };
}
function coordinateToPixels(geometry) {
  const rect = $('#react-container')[0].getBoundingClientRect();
  const x = (rect.width - 2) * geometry.x / 100;
  const y = (rect.height - 2) * geometry.y / 100;
  return {
      x,
      y,
  };
}

function Polygon (props) {
  const { geometry, data } = props.annotation  
  if (!geometry || !geometry.points || geometry.points.length === 0) return null
  let pointsAlreadyUsed = [];
  return (
    <div
      className={`linesContainer ${props.className}`}
      style={{
        width: '100%',
        height: '100%',
        position:'absolute',
        ...props.style
      }}
    >
      {(geometry.points.length >= 3) && geometry.points.map((item, i) => { // Iterate over points to create the edge lines
        let nextPoint;
        if (i === 0) { // First point (links from last to first)
          nextPoint = geometry.points[geometry.points.length - 1]
        } else {
          nextPoint = geometry.points[i - 1]
        }
        return (
          // Note that each LineTo element must have a unique key (unique relative to the connected points)
          <LineTo
            key={i + "_" + item.x + "_" + item.y + "_" + nextPoint.x + "_" + nextPoint.y}
            from="linesContainer"
            fromAnchor={item.x + "% " + item.y + "%"}
            to="linesContainer"
            toAnchor={nextPoint.x + "% " + nextPoint.y + "%"}
            borderColor={'limegreen'}
            borderStyle={'dashed'}
            borderWidth={1}
            className={(props.active || (data && data.hovered)) ? "Polygon-LineToActive" : "Polygon-LineTo"}
          />
        )
      })}
      {geometry.points.map((item,i) => { // Iterate over points to points
        let coordinates = coordinateToPixels(item);
        return (
          // Note that each LineTo element must have a unique key (unique relative to the point)
          <Rnd          
          bounds={"parent"}
          enableResizing={false}
          style={{zIndex:999}}
          position={{x:coordinates.x, y:coordinates.y}}
          onDragStop={(e, d) => {
            let newCoordinates = coordinatesToPercentage(d);
            item.x = newCoordinates.x;
            item.y = newCoordinates.y;
            mapzer_newtreinamento_edit.processImageAnnotation();
          }}
          key={i + "_" + item.x + "_" + item.y}
          >
            <PointDot />
          </Rnd>          
        )
      })}
    </div>
  )
}

Polygon.defaultProps = {
  className: '',
  style: {}
}

export default Polygon
