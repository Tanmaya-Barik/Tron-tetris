import React from 'react';
import { TETROMINOES } from '../../utils/tetrominoes';
import Cell from '../Cell/Cell';
import './PiecePreview.css';

const PiecePreview = ({ pieceShape, type, title, isSquare, noPanel }) => {
  const content = (
    <>
      {title && <div className="panel-title">{title}</div>}
      <div className="preview-grid-wrapper">
        <div className="preview-grid">
          {pieceShape ? (
            pieceShape.map((row, y) => (
              <div key={y}>
                {row.map((cell, x) => (
                  <Cell key={`${y}-${x}`} type={cell !== 0 ? type : 0} />
                ))}
              </div>
            ))
          ) : (
            <div className="empty-preview" />
          )}
        </div>
      </div>
    </>
  );

  if (noPanel) return content;

  return (
    <div className={`glass-panel preview-panel ${isSquare ? 'square' : ''}`}>
      {content}
    </div>
  );
};

export default PiecePreview;
