using AutoMapper;
using System;
using System.Linq.Expressions;

namespace AnimalCare.Extensions;

public static class AutoMapperExtensions
{
    public static IMappingExpression<TSource, TDestination> MapMembers<TSource, TDestination>(
        this IMappingExpression<TSource, TDestination> map,
        params (Expression<Func<TDestination, object>> dstSelector, Expression<Func<TSource, object>> srcSelector)[] selectors)
    {
        foreach (var selector in selectors)
        {
            map.ForMember(selector.dstSelector, config => config.MapFrom(selector.srcSelector));
        }
        return map;
    }

    public static IMappingExpression<TSource, TDestination> UseValue<TSource, TDestination, TValue>(
        this IMappingExpression<TSource, TDestination> map,
        Expression<Func<TDestination, object>> dstSelector,
        TValue value)
    {
        map.ForMember(dstSelector, config => config.MapFrom(src => value));
        return map;
    }

    public static IMappingExpression<TSource, TDestination> Ignore<TSource, TDestination>(
    this IMappingExpression<TSource, TDestination> map,
    params Expression<Func<TDestination, object?>>[] selectors)
    {
        foreach (var selector in selectors)
        {
            map.ForMember(selector, opt => opt.Ignore());
        }
        return map;
    }


    public static IMappingExpression<TSource, TDestination> IgnoreSource<TSource, TDestination>(
        this IMappingExpression<TSource, TDestination> map,
        Expression<Func<TSource, object>> selector)
    {
        map.ForSourceMember(selector, opt => opt.DoNotValidate());
        return map;
    }
}

