// components/Card.js
import React from 'react';
import Button from './Button';
import PropTypes from 'prop-types';

function Card({ title, imageSrc, infoItems, buttons, children }) {
    return (
        <div className="border p-7 rounded-lg shadow-sm w-full max-w-md bg-white flex flex-col justify-between">
            {title && <h3 className="text-xl font-semibold flex items-start mb-3">{title}</h3>}
            <hr className="my-2" />
            <div className="flex items-start justify-between">
                {/* Information Section */}
                <div className="space-y-3">
                    {infoItems.map((item, index) => (
                        <div key={index} className="flex items-center">
                            {item.icon && (
                                <img src={item.icon} alt={`${item.label} Icon`} className="h-6 w-6 mr-2" />
                            )}
                            <div>
                                <p className="text-gray-500">{item.label}</p>
                                <p className="text-gray-700 font-semibold">{item.value}</p>
                            </div>
                        </div>
                    ))}
                    {children}
                </div>

                {/* Image on the right */}
                {imageSrc && (
                    <div className="flex-shrink-0 flex items-center ml-4">
                        <img src={imageSrc} alt="Image" className="w-24 h-24 rounded-2xl object-cover" />
                    </div>
                )}
            </div>
            <hr className="my-3" />

            {/* Buttons Section */}
            {buttons && buttons.length > 0 && (
                <div className="flex justify-center gap-16">
                    {buttons.map((buttonProps, index) => (
                        <Button key={index} {...buttonProps} />
                    ))}
                </div>
            )}
        </div>
    );
}

Card.propTypes = {
    title: PropTypes.string,
    imageSrc: PropTypes.string,
    infoItems: PropTypes.arrayOf(
        PropTypes.shape({
            icon: PropTypes.string,
            label: PropTypes.string,
            value: PropTypes.string,
        })
    ),
    buttons: PropTypes.arrayOf(PropTypes.object),
    children: PropTypes.node,
};

Card.defaultProps = {
    infoItems: [],
    buttons: [],
};

export default Card;
