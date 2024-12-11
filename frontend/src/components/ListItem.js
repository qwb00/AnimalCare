import React from 'react';
import Button from './Button';
import PropTypes from 'prop-types';

function ListItem({ title, imageSrc, infoItems, buttons, children }) {
    return (
        <div className="flex items-center justify-between p-4 border-b last:border-none">
            {/* Left Section with Icon and Info */}
            <div className="flex items-center space-x-4">
                {/* Image */}
                {imageSrc && (
                    <img src={imageSrc} alt="Image" className="w-16 h-16 rounded-full object-cover" />
                )}

                {/* Information Section */}
                <div className="space-y-1">
                    {title && <h4 className="text-lg font-semibold">{title}</h4>}
                    {infoItems.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            {item.icon && (
                                <img src={item.icon} alt={`${item.label} Icon`} className="h-5 w-5" />
                            )}
                            <div>
                                <span className="text-gray-500 text-sm">{item.label}: </span>
                                <span className={`${item.customClass || 'text-gray-700'} font-medium`}>{item.value}</span>
                            </div>
                        </div>
                    ))}
                    {children}
                </div>
            </div>

            {/* Right Section with Buttons */}
            {buttons && buttons.length > 0 && (
                <div className="flex space-x-2">
                    {buttons.map((buttonProps, index) => (
                        <Button
                            key={index}
                            {...buttonProps}
                            className={`px-4 py-2 ${buttonProps.className}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// PropTypes to ensure correct usage
ListItem.propTypes = {
    title: PropTypes.string,
    imageSrc: PropTypes.string,
    infoItems: PropTypes.arrayOf(
        PropTypes.shape({
            icon: PropTypes.string,
            label: PropTypes.string,
            value: PropTypes.string,
            customClass: PropTypes.string,
        })
    ),
    buttons: PropTypes.arrayOf(PropTypes.object),
    children: PropTypes.node,
};

ListItem.defaultProps = {
    infoItems: [],
    buttons: [],
};

export default ListItem;
